package com.optronix.salesmgmt.modules.meeting.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CreateMeetingRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Assigned employee ID is required")
    private Long assignedEmployeeId;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @NotNull(message = "Scheduled start time is required")
    private LocalDateTime scheduledStartTime;

    @NotNull(message = "Scheduled end time is required")
    private LocalDateTime scheduledEndTime;

    @NotBlank(message = "Meeting location is required")
    private String meetingLocation;

    private String meetingLink;
    private String notes;

    public CreateMeetingRequest() {}

    public CreateMeetingRequest(Long customerId, Long assignedEmployeeId, String purpose,
                                LocalDateTime scheduledStartTime, LocalDateTime scheduledEndTime,
                                String meetingLocation, String notes) {
        this(customerId, assignedEmployeeId, purpose, scheduledStartTime, scheduledEndTime, meetingLocation, null, notes);
    }

    public CreateMeetingRequest(Long customerId, Long assignedEmployeeId, String purpose,
                                LocalDateTime scheduledStartTime, LocalDateTime scheduledEndTime,
                                String meetingLocation, String meetingLink, String notes) {
        this.customerId = customerId;
        this.assignedEmployeeId = assignedEmployeeId;
        this.purpose = purpose;
        this.scheduledStartTime = scheduledStartTime;
        this.scheduledEndTime = scheduledEndTime;
        this.meetingLocation = meetingLocation;
        this.meetingLink = meetingLink;
        this.notes = notes;
    }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getAssignedEmployeeId() { return assignedEmployeeId; }
    public void setAssignedEmployeeId(Long assignedEmployeeId) { this.assignedEmployeeId = assignedEmployeeId; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public LocalDateTime getScheduledStartTime() { return scheduledStartTime; }
    public void setScheduledStartTime(LocalDateTime scheduledStartTime) { this.scheduledStartTime = scheduledStartTime; }

    public LocalDateTime getScheduledEndTime() { return scheduledEndTime; }
    public void setScheduledEndTime(LocalDateTime scheduledEndTime) { this.scheduledEndTime = scheduledEndTime; }

    public String getMeetingLocation() { return meetingLocation; }
    public void setMeetingLocation(String meetingLocation) { this.meetingLocation = meetingLocation; }

    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
