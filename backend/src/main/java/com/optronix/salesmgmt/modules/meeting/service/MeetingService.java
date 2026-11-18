package com.optronix.salesmgmt.modules.meeting.service;

import com.optronix.salesmgmt.modules.meeting.dto.*;
import com.optronix.salesmgmt.modules.meeting.entity.MeetingStatus;

import java.util.List;

public interface MeetingService {

    MeetingDto createMeeting(CreateMeetingRequest request, String currentUsername);

    MeetingDto getMeetingById(Long id);

    List<MeetingDto> getMeetings(MeetingStatus status, Long assignedEmployeeId, String currentUsername, boolean isManager);

    MeetingDto confirmMeeting(Long id, String currentUsername);

    MeetingDto checkIn(Long id, CheckInRequest request, String currentUsername);

    MeetingDto startMeeting(Long id, String currentUsername);

    MeetingDto pauseMeeting(Long id, CheckOutRequest request, String currentUsername);

    MeetingDto resumeMeeting(Long id, CheckInRequest request, String currentUsername);

    MeetingDto completeMeeting(Long id, CompleteMeetingRequest request, String currentUsername);

    MeetingDto reopenMeeting(Long id, ReopenMeetingRequest request, String managerUsername);

    MeetingDto cancelMeeting(Long id, String currentUsername);

    List<MeetingAuditLogDto> getMeetingAuditLogs(Long meetingId);
}
