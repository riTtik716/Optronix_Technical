package com.optronix.salesmgmt.modules.meeting.entity;

public enum MeetingOutcome {
    INTERESTED,
    FOLLOW_UP_REQUIRED,
    PROPOSAL_REQUESTED,
    NOT_INTERESTED,
    UNABLE_TO_MEET;

    public boolean requiresFollowUp() {
        return this == FOLLOW_UP_REQUIRED;
    }
}
