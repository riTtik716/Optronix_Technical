package com.optronix.salesmgmt.modules.followup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateFollowUpRequest {

    @NotNull(message = "Meeting ID is required")
    private Long meetingId;

    @NotNull(message = "Owner ID is required")
    private Long ownerId;

    @NotBlank(message = "Action item is required")
    private String actionItem;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private String notes;

    public CreateFollowUpRequest() {}

    public CreateFollowUpRequest(Long meetingId, Long ownerId, String actionItem, LocalDate dueDate, String notes) {
        this.meetingId = meetingId;
        this.ownerId = ownerId;
        this.actionItem = actionItem;
        this.dueDate = dueDate;
        this.notes = notes;
    }

    public Long getMeetingId() { return meetingId; }
    public void setMeetingId(Long meetingId) { this.meetingId = meetingId; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }

    public String getActionItem() { return actionItem; }
    public void setActionItem(String actionItem) { this.actionItem = actionItem; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
