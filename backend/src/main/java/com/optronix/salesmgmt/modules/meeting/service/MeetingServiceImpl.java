package com.optronix.salesmgmt.modules.meeting.service;

import com.optronix.salesmgmt.exception.BadRequestException;
import com.optronix.salesmgmt.exception.ResourceNotFoundException;
import com.optronix.salesmgmt.modules.auth.entity.User;
import com.optronix.salesmgmt.modules.auth.repository.UserRepository;
import com.optronix.salesmgmt.modules.customer.dto.CustomerDto;
import com.optronix.salesmgmt.modules.customer.entity.Customer;
import com.optronix.salesmgmt.modules.customer.repository.CustomerRepository;
import com.optronix.salesmgmt.modules.followup.dto.CreateFollowUpRequest;
import com.optronix.salesmgmt.modules.followup.service.FollowUpService;
import com.optronix.salesmgmt.modules.meeting.dto.*;
import com.optronix.salesmgmt.modules.meeting.entity.*;
import com.optronix.salesmgmt.modules.meeting.repository.MeetingAuditLogRepository;
import com.optronix.salesmgmt.modules.meeting.repository.MeetingRepository;
import com.optronix.salesmgmt.modules.meeting.repository.MeetingSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MeetingServiceImpl implements MeetingService {

    private final MeetingRepository meetingRepository;
    private final MeetingSessionRepository sessionRepository;
    private final MeetingAuditLogRepository auditLogRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final FollowUpService followUpService;
    private final MeetingStateMachine stateMachine;

    public MeetingServiceImpl(MeetingRepository meetingRepository,
                              MeetingSessionRepository sessionRepository,
                              MeetingAuditLogRepository auditLogRepository,
                              CustomerRepository customerRepository,
                              UserRepository userRepository,
                              FollowUpService followUpService,
                              MeetingStateMachine stateMachine) {
        this.meetingRepository = meetingRepository;
        this.sessionRepository = sessionRepository;
        this.auditLogRepository = auditLogRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.followUpService = followUpService;
        this.stateMachine = stateMachine;
    }

    @Override
    public MeetingDto createMeeting(CreateMeetingRequest request, String currentUsername) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));

        User assignedEmployee = userRepository.findById(request.getAssignedEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedEmployeeId()));

        User currentUser = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUsername));

        Meeting meeting = new Meeting(
                customer,
                assignedEmployee,
                request.getPurpose(),
                request.getScheduledStartTime(),
                request.getScheduledEndTime(),
                request.getMeetingLocation(),
                request.getNotes()
        );
        meeting.setMeetingLink(request.getMeetingLink());

        Meeting saved = meetingRepository.save(meeting);

        MeetingAuditLog log = new MeetingAuditLog(
                saved,
                currentUser,
                "CREATE_MEETING",
                null,
                MeetingStatus.SCHEDULED,
                "Meeting created and scheduled",
                LocalDateTime.now()
        );
        auditLogRepository.save(log);

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public MeetingDto getMeetingById(Long id) {
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting", "id", id));
        return mapToDto(meeting);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MeetingDto> getMeetings(MeetingStatus status, Long assignedEmployeeId, String currentUsername, boolean isManager) {
        List<Meeting> list;
        if (isManager) {
            list = meetingRepository.searchMeetings(status, assignedEmployeeId);
        } else {
            User user = userRepository.findByEmail(currentUsername)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUsername));
            list = meetingRepository.searchMeetings(status, user.getId());
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public MeetingDto confirmMeeting(Long id, String currentUsername) {
        Meeting meeting = getMeetingEntity(id);
        User currentUser = getCurrentUser(currentUsername);

        MeetingStatus prev = meeting.getStatus();
        meeting.setStatus(MeetingStatus.CONFIRMED);
        recordAudit(meeting, currentUser, "CONFIRM_MEETING", prev, MeetingStatus.CONFIRMED, "Meeting confirmed");

        return mapToDto(meetingRepository.save(meeting));
    }

    @Override
    public MeetingDto checkIn(Long id, CheckInRequest request, String currentUsername) {
        Meeting meeting = getMeetingEntity(id);
        User currentUser = getCurrentUser(currentUsername);

        MeetingStatus prev = meeting.getStatus();
        meeting.setStatus(MeetingStatus.CHECKED_IN);

        int nextSessionNumber = meeting.getSessions().size() + 1;
        MeetingSession session = new MeetingSession(
                meeting,
                nextSessionNumber,
                LocalDateTime.now(),
                request.getLatitude(),
                request.getLongitude(),
                request.getLocationName()
        );
        session.setSessionNotes(request.getNotes());
        meeting.addSession(session);

        recordAudit(meeting, currentUser, "CHECK_IN", prev, MeetingStatus.CHECKED_IN, "Checked in for session " + nextSessionNumber);
        return mapToDto(meetingRepository.save(meeting));
    }

    @Override
    public MeetingDto startMeeting(Long id, String currentUsername) {
        Meeting meeting = getMeetingEntity(id);
        User currentUser = getCurrentUser(currentUsername);

        MeetingStatus prev = meeting.getStatus();
        meeting.setStatus(MeetingStatus.IN_PROGRESS);
        recordAudit(meeting, currentUser, "START_MEETING", prev, MeetingStatus.IN_PROGRESS, "Meeting discussions started");

        return mapToDto(meetingRepository.save(meeting));
    }

    @Override
    public MeetingDto pauseMeeting(Long id, CheckOutRequest request, String currentUsername) {
        Meeting meeting = getMeetingEntity(id);
        User currentUser = getCurrentUser(currentUsername);

        // Close current active session
        closeActiveSession(meeting, request.getLatitude(), request.getLongitude(), request.getLocationName(), request.getNotes());

        MeetingStatus prev = meeting.getStatus();
        meeting.setStatus(MeetingStatus.CONFIRMED);
        recordAudit(meeting, currentUser, "PAUSE_MEETING", prev, MeetingStatus.CONFIRMED, "Visit paused. Will resume later.");

        return mapToDto(meetingRepository.save(meeting));
    }

    @Override
    public MeetingDto resumeMeeting(Long id, CheckInRequest request, String currentUsername) {
        Meeting meeting = getMeetingEntity(id);
        User currentUser = getCurrentUser(currentUsername);

        MeetingStatus prev = meeting.getStatus();
        meeting.setStatus(MeetingStatus.CHECKED_IN);

        int nextSessionNumber = meeting.getSessions().size() + 1;
        MeetingSession session = new MeetingSession(
                meeting,
                nextSessionNumber,
                LocalDateTime.now(),
                request.getLatitude(),
                request.getLongitude(),
                request.getLocationName()
        );
        session.setSessionNotes(request.getNotes());
        meeting.addSession(session);

        recordAudit(meeting, currentUser, "RESUME_MEETING", prev, MeetingStatus.CHECKED_IN, "Resumed meeting session " + nextSessionNumber);
        return mapToDto(meetingRepository.save(meeting));
    }

    @Override
    public MeetingDto completeMeeting(Long id, CompleteMeetingRequest request, String currentUsername) {
        Meeting meeting = getMeetingEntity(id);
        User currentUser = getCurrentUser(currentUsername);

        if (request.getOutcome() != null && request.getOutcome().requiresFollowUp()) {
            if (request.getActionItem() == null || request.getActionItem().isBlank() ||
                request.getDueDate() == null || request.getFollowUpOwnerId() == null) {
                throw new BadRequestException("Follow-up action item, due date, and owner are mandatory when outcome requires follow-up");
            }
        }

        // Close current active session if not already closed
        closeActiveSession(meeting, request.getLatitude(), request.getLongitude(), request.getLocationName(), request.getOutcomeNotes());

        MeetingStatus prev = meeting.getStatus();
        meeting.setStatus(MeetingStatus.COMPLETED);
        meeting.setOutcome(request.getOutcome());
        meeting.setOutcomeNotes(request.getOutcomeNotes());

        Meeting saved = meetingRepository.save(meeting);

        // Create follow-up if required
        if (request.getOutcome() != null && request.getOutcome().requiresFollowUp()) {
            CreateFollowUpRequest fuReq = new CreateFollowUpRequest(
                    saved.getId(),
                    request.getFollowUpOwnerId(),
                    request.getActionItem(),
                    request.getDueDate(),
                    request.getOutcomeNotes()
            );
            followUpService.createFollowUp(fuReq, currentUsername);
        }

        recordAudit(saved, currentUser, "COMPLETE_MEETING", prev, MeetingStatus.COMPLETED, "Meeting completed with outcome: " + request.getOutcome());

        return mapToDto(saved);
    }

    @Override
    public MeetingDto reopenMeeting(Long id, ReopenMeetingRequest request, String managerUsername) {
        if (request.getReason() == null || request.getReason().isBlank()) {
            throw new BadRequestException("Reason is required to reopen a meeting");
        }

        Meeting meeting = getMeetingEntity(id);
        User manager = getCurrentUser(managerUsername);

        MeetingStatus prev = meeting.getStatus();
        meeting.setStatus(MeetingStatus.REOPENED);
        meeting.setReopenedCount(meeting.getReopenedCount() != null ? meeting.getReopenedCount() + 1 : 1);

        Meeting saved = meetingRepository.save(meeting);
        recordAudit(saved, manager, "REOPEN_MEETING", prev, MeetingStatus.REOPENED, request.getReason());

        return mapToDto(saved);
    }

    @Override
    public MeetingDto cancelMeeting(Long id, String currentUsername) {
        Meeting meeting = getMeetingEntity(id);
        User currentUser = getCurrentUser(currentUsername);

        MeetingStatus prev = meeting.getStatus();
        meeting.setStatus(MeetingStatus.CANCELLED);
        recordAudit(meeting, currentUser, "CANCEL_MEETING", prev, MeetingStatus.CANCELLED, "Meeting cancelled");

        return mapToDto(meetingRepository.save(meeting));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MeetingAuditLogDto> getMeetingAuditLogs(Long meetingId) {
        return auditLogRepository.findByMeetingIdOrderByTimestampDesc(meetingId).stream()
                .map(a -> {
                    MeetingAuditLogDto aDto = new MeetingAuditLogDto();
                    aDto.setId(a.getId());
                    aDto.setAction(a.getAction());
                    aDto.setFromStatus(a.getPreviousStatus());
                    aDto.setToStatus(a.getNewStatus());
                    aDto.setPerformedBy(a.getPerformedBy() != null ? a.getPerformedBy().getFullName() : "System");
                    aDto.setPerformedAt(a.getTimestamp());
                    aDto.setReason(a.getReason());
                    return aDto;
                })
                .collect(Collectors.toList());
    }

    private Meeting getMeetingEntity(Long id) {
        return meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting", "id", id));
    }

    private User getCurrentUser(String usernameOrEmail) {
        return userRepository.findByEmail(usernameOrEmail)
                .orElseGet(() -> userRepository.findByUsername(usernameOrEmail)
                        .orElseThrow(() -> new ResourceNotFoundException("User", "username/email", usernameOrEmail)));
    }

    private void closeActiveSession(Meeting meeting, Double lat, Double lon, String loc, String notes) {
        if (!meeting.getSessions().isEmpty()) {
            MeetingSession last = meeting.getSessions().get(meeting.getSessions().size() - 1);
            if (last.getCheckOutTime() == null) {
                last.setCheckOutTime(LocalDateTime.now());
                if (lat != null) last.setCheckOutLatitude(lat);
                if (lon != null) last.setCheckOutLongitude(lon);
                if (loc != null) last.setCheckOutLocationName(loc);
                if (notes != null && last.getSessionNotes() == null) last.setSessionNotes(notes);
            }
        }
    }

    private void recordAudit(Meeting meeting, User user, String action,
                             MeetingStatus prev, MeetingStatus next, String reason) {
        MeetingAuditLog log = new MeetingAuditLog(
                meeting,
                user,
                action,
                prev,
                next,
                reason,
                LocalDateTime.now()
        );
        auditLogRepository.save(log);
    }

    public MeetingDto mapToDto(Meeting meeting) {
        MeetingDto dto = new MeetingDto();
        dto.setId(meeting.getId());

        dto.setCustomer(CustomerDto.fromEntity(meeting.getCustomer()));

        dto.setAssignedEmployeeId(meeting.getAssignedEmployee().getId());
        dto.setAssignedEmployeeName(meeting.getAssignedEmployee().getFullName());
        dto.setAssignedEmployeeEmail(meeting.getAssignedEmployee().getEmail());
        if (meeting.getAssignedEmployee().getManagerId() != null) {
            dto.setAssignedEmployeeManagerId(meeting.getAssignedEmployee().getManagerId());
            userRepository.findById(meeting.getAssignedEmployee().getManagerId())
                    .ifPresent(m -> dto.setAssignedEmployeeManagerName(m.getName()));
        }
        dto.setPurpose(meeting.getPurpose());
        dto.setScheduledStartTime(meeting.getScheduledStartTime());
        dto.setScheduledEndTime(meeting.getScheduledEndTime());
        dto.setMeetingLocation(meeting.getMeetingLocation());
        dto.setMeetingLink(meeting.getMeetingLink());
        dto.setNotes(meeting.getNotes());
        dto.setStatus(meeting.getStatus());
        dto.setOutcome(meeting.getOutcome());
        dto.setOutcomeNotes(meeting.getOutcomeNotes());
        dto.setReopenedCount(meeting.getReopenedCount());
        dto.setCreatedAt(meeting.getCreatedAt());
        dto.setUpdatedAt(meeting.getUpdatedAt());

        long totalMinutes = 0L;
        List<MeetingSessionDto> sessionDtos = new ArrayList<>();
        if (meeting.getSessions() != null) {
            for (MeetingSession s : meeting.getSessions()) {
                MeetingSessionDto sDto = new MeetingSessionDto();
                sDto.setId(s.getId());
                sDto.setSessionNumber(s.getSessionNumber());
                sDto.setCheckInTime(s.getCheckInTime());
                sDto.setCheckInLatitude(s.getCheckInLatitude());
                sDto.setCheckInLongitude(s.getCheckInLongitude());
                sDto.setCheckInLocationName(s.getCheckInLocationName());
                sDto.setCheckOutTime(s.getCheckOutTime());
                sDto.setCheckOutLatitude(s.getCheckOutLatitude());
                sDto.setCheckOutLongitude(s.getCheckOutLongitude());
                sDto.setCheckOutLocationName(s.getCheckOutLocationName());
                sDto.setSessionNotes(s.getSessionNotes());

                if (s.getCheckInTime() != null && s.getCheckOutTime() != null) {
                    long duration = Duration.between(s.getCheckInTime(), s.getCheckOutTime()).toMinutes();
                    sDto.setDurationMinutes(Math.max(0, duration));
                    totalMinutes += sDto.getDurationMinutes();
                }
                sessionDtos.add(sDto);
            }
        }
        dto.setSessions(sessionDtos);
        dto.setSessionCount(sessionDtos.size());
        dto.setTotalDurationMinutes(totalMinutes);

        List<MeetingAuditLogDto> auditDtos = new ArrayList<>();
        if (meeting.getAuditLogs() != null) {
            for (MeetingAuditLog a : meeting.getAuditLogs()) {
                MeetingAuditLogDto aDto = new MeetingAuditLogDto();
                aDto.setId(a.getId());
                aDto.setAction(a.getAction());
                aDto.setFromStatus(a.getPreviousStatus());
                aDto.setToStatus(a.getNewStatus());
                aDto.setPerformedBy(a.getPerformedBy() != null ? a.getPerformedBy().getFullName() : "System");
                aDto.setPerformedAt(a.getTimestamp());
                aDto.setReason(a.getReason());
                auditDtos.add(aDto);
            }
        }
        dto.setAuditLogs(auditDtos);

        return dto;
    }
}
