package com.optronix.salesmgmt.modules.meeting.controller;

import com.optronix.salesmgmt.modules.auth.entity.Role;
import com.optronix.salesmgmt.modules.auth.security.CustomUserDetails;
import com.optronix.salesmgmt.modules.meeting.dto.*;
import com.optronix.salesmgmt.modules.meeting.entity.MeetingStatus;
import com.optronix.salesmgmt.modules.meeting.service.MeetingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @PostMapping
    public ResponseEntity<MeetingDto> createMeeting(@Valid @RequestBody CreateMeetingRequest request,
                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        MeetingDto created = meetingService.createMeeting(request, userDetails.getUsername());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingDto> getMeetingById(@PathVariable Long id) {
        return ResponseEntity.ok(meetingService.getMeetingById(id));
    }

    @GetMapping("/{id}/audit-logs")
    public ResponseEntity<List<MeetingAuditLogDto>> getMeetingAuditLogs(@PathVariable Long id) {
        return ResponseEntity.ok(meetingService.getMeetingAuditLogs(id));
    }

    @GetMapping
    public ResponseEntity<List<MeetingDto>> getMeetings(
            @RequestParam(required = false) MeetingStatus status,
            @RequestParam(required = false) Long assignedEmployeeId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean isManager = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Role.ROLE_SALES_MANAGER.name()) ||
                               a.getAuthority().equals(Role.ROLE_ADMIN.name()) ||
                               a.getAuthority().equals("ROLE_SALES_MANAGER") ||
                               a.getAuthority().equals("ROLE_ADMIN"));

        List<MeetingDto> meetings = meetingService.getMeetings(status, assignedEmployeeId, userDetails.getUsername(), isManager);
        return ResponseEntity.ok(meetings);
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<MeetingDto> confirmMeeting(@PathVariable Long id,
                                                     @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(meetingService.confirmMeeting(id, userDetails.getUsername()));
    }

    @PostMapping("/{id}/check-in")
    public ResponseEntity<MeetingDto> checkIn(@PathVariable Long id,
                                              @RequestBody(required = false) CheckInRequest request,
                                              @AuthenticationPrincipal CustomUserDetails userDetails) {
        CheckInRequest req = request != null ? request : new CheckInRequest();
        return ResponseEntity.ok(meetingService.checkIn(id, req, userDetails.getUsername()));
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<MeetingDto> startMeeting(@PathVariable Long id,
                                                   @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(meetingService.startMeeting(id, userDetails.getUsername()));
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<MeetingDto> pauseMeeting(@PathVariable Long id,
                                                   @RequestBody(required = false) CheckOutRequest request,
                                                   @AuthenticationPrincipal CustomUserDetails userDetails) {
        CheckOutRequest req = request != null ? request : new CheckOutRequest();
        return ResponseEntity.ok(meetingService.pauseMeeting(id, req, userDetails.getUsername()));
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<MeetingDto> resumeMeeting(@PathVariable Long id,
                                                    @RequestBody(required = false) CheckInRequest request,
                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        CheckInRequest req = request != null ? request : new CheckInRequest();
        return ResponseEntity.ok(meetingService.resumeMeeting(id, req, userDetails.getUsername()));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<MeetingDto> completeMeeting(@PathVariable Long id,
                                                      @Valid @RequestBody CompleteMeetingRequest request,
                                                      @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(meetingService.completeMeeting(id, request, userDetails.getUsername()));
    }

    @PostMapping("/{id}/reopen")
    @PreAuthorize("hasAnyRole('SALES_MANAGER', 'ADMIN', 'ROLE_SALES_MANAGER', 'ROLE_ADMIN')")
    public ResponseEntity<MeetingDto> reopenMeeting(@PathVariable Long id,
                                                    @Valid @RequestBody ReopenMeetingRequest request,
                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(meetingService.reopenMeeting(id, request, userDetails.getUsername()));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<MeetingDto> cancelMeeting(@PathVariable Long id,
                                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(meetingService.cancelMeeting(id, userDetails.getUsername()));
    }
}
