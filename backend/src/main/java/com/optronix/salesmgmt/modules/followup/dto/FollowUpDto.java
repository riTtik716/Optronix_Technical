package com.optronix.salesmgmt.modules.followup.dto;

import com.optronix.salesmgmt.modules.followup.entity.FollowUpStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class FollowUpDto {

    private Long id;
    private Long meetingId;
    private String meetingPurpose;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private String actionItem;
    private LocalDate dueDate;
    private FollowUpStatus status;
    private String notes;
    private LocalDateTime createdAt;

    public FollowUpDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMeetingId() { return meetingId; }
    public void setMeetingId(Long meetingId) { this.meetingId = meetingId; }

    public String getMeetingPurpose() { return meetingPurpose; }
    public void setMeetingPurpose(String meetingPurpose) { this.meetingPurpose = meetingPurpose; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public String getActionItem() { return actionItem; }
    public void setActionItem(String actionItem) { this.actionItem = actionItem; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public FollowUpStatus getStatus() { return status; }
    public void setStatus(FollowUpStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
