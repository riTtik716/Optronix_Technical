package com.optronix.salesmgmt.modules.followup.service;

import com.optronix.salesmgmt.exception.ResourceNotFoundException;
import com.optronix.salesmgmt.modules.auth.entity.User;
import com.optronix.salesmgmt.modules.auth.repository.UserRepository;
import com.optronix.salesmgmt.modules.followup.dto.CreateFollowUpRequest;
import com.optronix.salesmgmt.modules.followup.dto.FollowUpDto;
import com.optronix.salesmgmt.modules.followup.entity.FollowUp;
import com.optronix.salesmgmt.modules.followup.entity.FollowUpStatus;
import com.optronix.salesmgmt.modules.followup.repository.FollowUpRepository;
import com.optronix.salesmgmt.modules.meeting.entity.Meeting;
import com.optronix.salesmgmt.modules.meeting.repository.MeetingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FollowUpServiceImpl implements FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    public FollowUpServiceImpl(FollowUpRepository followUpRepository,
                               MeetingRepository meetingRepository,
                               UserRepository userRepository) {
        this.followUpRepository = followUpRepository;
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
    }

    @Override
    public FollowUpDto createFollowUp(CreateFollowUpRequest request, String currentUsername) {
        Meeting meeting = meetingRepository.findById(request.getMeetingId())
                .orElseThrow(() -> new ResourceNotFoundException("Meeting", "id", request.getMeetingId()));

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getOwnerId()));

        FollowUp followUp = new FollowUp(
                meeting,
                owner,
                request.getActionItem(),
                request.getDueDate(),
                request.getNotes()
        );

        FollowUp saved = followUpRepository.save(followUp);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FollowUpDto> getFollowUps(Long meetingId, String currentUsername, boolean isManager) {
        List<FollowUp> list;
        if (meetingId != null) {
            list = followUpRepository.findByMeetingId(meetingId);
        } else if (isManager) {
            list = followUpRepository.findAll();
        } else {
            list = followUpRepository.findByOwnerUsername(currentUsername);
        }

        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public FollowUpDto updateStatus(Long id, FollowUpStatus newStatus, String currentUsername) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FollowUp", "id", id));

        followUp.setStatus(newStatus);
        return mapToDto(followUpRepository.save(followUp));
    }

    public FollowUpDto mapToDto(FollowUp followUp) {
        FollowUpDto dto = new FollowUpDto();
        dto.setId(followUp.getId());
        dto.setMeetingId(followUp.getMeeting().getId());
        dto.setMeetingPurpose(followUp.getMeeting().getPurpose());
        dto.setOwnerId(followUp.getOwner().getId());
        dto.setOwnerName(followUp.getOwner().getFullName());
        dto.setOwnerEmail(followUp.getOwner().getEmail());
        dto.setActionItem(followUp.getActionItem());
        dto.setDueDate(followUp.getDueDate());
        dto.setStatus(followUp.getStatus());
        dto.setNotes(followUp.getNotes());
        dto.setCreatedAt(followUp.getCreatedAt());
        return dto;
    }
}
