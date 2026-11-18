package com.optronix.salesmgmt.modules.meeting.dto;

import com.optronix.salesmgmt.modules.meeting.entity.MeetingOutcome;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CompleteMeetingRequest {

    @NotNull(message = "Meeting outcome is required")
    private MeetingOutcome outcome;

    private String outcomeNotes;

    // Follow-up details if outcome requires follow-up
    private String actionItem;
    private LocalDate dueDate;
    private Long followUpOwnerId;

    // Optional check-out coords
    private Double latitude;
    private Double longitude;
    private String locationName;

    public CompleteMeetingRequest() {}

    public CompleteMeetingRequest(MeetingOutcome outcome, String outcomeNotes,
                                  String actionItem, LocalDate dueDate, Long followUpOwnerId,
                                  Double latitude, Double longitude, String locationName) {
        this.outcome = outcome;
        this.outcomeNotes = outcomeNotes;
        this.actionItem = actionItem;
        this.dueDate = dueDate;
        this.followUpOwnerId = followUpOwnerId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.locationName = locationName;
    }

    public MeetingOutcome getOutcome() { return outcome; }
    public void setOutcome(MeetingOutcome outcome) { this.outcome = outcome; }

    public String getOutcomeNotes() { return outcomeNotes; }
    public void setOutcomeNotes(String outcomeNotes) { this.outcomeNotes = outcomeNotes; }

    public String getActionItem() { return actionItem; }
    public void setActionItem(String actionItem) { this.actionItem = actionItem; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Long getFollowUpOwnerId() { return followUpOwnerId; }
    public void setFollowUpOwnerId(Long followUpOwnerId) { this.followUpOwnerId = followUpOwnerId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
}
