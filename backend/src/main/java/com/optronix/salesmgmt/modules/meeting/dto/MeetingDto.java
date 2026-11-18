package com.optronix.salesmgmt.modules.meeting.dto;

import com.optronix.salesmgmt.modules.customer.dto.CustomerDto;
import com.optronix.salesmgmt.modules.meeting.entity.MeetingOutcome;
import com.optronix.salesmgmt.modules.meeting.entity.MeetingStatus;
import java.time.LocalDateTime;
import java.util.List;

public class MeetingDto {

    private Long id;
    private CustomerDto customer;
    private Long assignedEmployeeId;
    private String assignedEmployeeName;
    private String assignedEmployeeEmail;
    private Long assignedEmployeeManagerId;
    private String assignedEmployeeManagerName;
    private String purpose;
    private LocalDateTime scheduledStartTime;
    private LocalDateTime scheduledEndTime;
    private String meetingLocation;
    private String meetingLink;
    private String notes;
    private MeetingStatus status;
    private MeetingOutcome outcome;
    private String outcomeNotes;
    private Integer reopenedCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MeetingSessionDto> sessions;
    private List<MeetingAuditLogDto> auditLogs;
    private Long totalDurationMinutes;
    private Integer sessionCount;

    public MeetingDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CustomerDto getCustomer() { return customer; }
    public void setCustomer(CustomerDto customer) { this.customer = customer; }

    public String getCustomerName() {
        return customer != null ? customer.companyName() : null;
    }

    public String getLocationAddress() {
        return meetingLocation;
    }

    public Long getAssignedEmployeeId() { return assignedEmployeeId; }
    public void setAssignedEmployeeId(Long assignedEmployeeId) { this.assignedEmployeeId = assignedEmployeeId; }

    public String getAssignedEmployeeName() { return assignedEmployeeName; }
    public void setAssignedEmployeeName(String assignedEmployeeName) { this.assignedEmployeeName = assignedEmployeeName; }

    public String getAssignedEmployeeEmail() { return assignedEmployeeEmail; }
    public void setAssignedEmployeeEmail(String assignedEmployeeEmail) { this.assignedEmployeeEmail = assignedEmployeeEmail; }

    public Long getAssignedEmployeeManagerId() { return assignedEmployeeManagerId; }
    public void setAssignedEmployeeManagerId(Long assignedEmployeeManagerId) { this.assignedEmployeeManagerId = assignedEmployeeManagerId; }

    public String getAssignedEmployeeManagerName() { return assignedEmployeeManagerName; }
    public void setAssignedEmployeeManagerName(String assignedEmployeeManagerName) { this.assignedEmployeeManagerName = assignedEmployeeManagerName; }

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

    public MeetingStatus getStatus() { return status; }
    public void setStatus(MeetingStatus status) { this.status = status; }

    public MeetingOutcome getOutcome() { return outcome; }
    public void setOutcome(MeetingOutcome outcome) { this.outcome = outcome; }

    public String getOutcomeNotes() { return outcomeNotes; }
    public void setOutcomeNotes(String outcomeNotes) { this.outcomeNotes = outcomeNotes; }

    public Integer getReopenedCount() { return reopenedCount; }
    public void setReopenedCount(Integer reopenedCount) { this.reopenedCount = reopenedCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<MeetingSessionDto> getSessions() { return sessions; }
    public void setSessions(List<MeetingSessionDto> sessions) { this.sessions = sessions; }

    public List<MeetingAuditLogDto> getAuditLogs() { return auditLogs; }
    public void setAuditLogs(List<MeetingAuditLogDto> auditLogs) { this.auditLogs = auditLogs; }

    public Long getTotalDurationMinutes() { return totalDurationMinutes; }
    public void setTotalDurationMinutes(Long totalDurationMinutes) { this.totalDurationMinutes = totalDurationMinutes; }

    public Integer getSessionCount() { return sessionCount; }
    public void setSessionCount(Integer sessionCount) { this.sessionCount = sessionCount; }
}
