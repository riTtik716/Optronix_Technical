package com.optronix.salesmgmt.modules.meeting.dto;

import jakarta.validation.constraints.NotBlank;

public class ReopenMeetingRequest {

    @NotBlank(message = "Reason for reopening is mandatory")
    private String reason;

    public ReopenMeetingRequest() {}

    public ReopenMeetingRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
