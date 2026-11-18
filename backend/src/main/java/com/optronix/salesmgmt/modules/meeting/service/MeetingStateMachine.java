package com.optronix.salesmgmt.modules.meeting.service;

import com.optronix.salesmgmt.exception.BadRequestException;
import com.optronix.salesmgmt.modules.meeting.entity.MeetingStatus;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

@Component
public class MeetingStateMachine {

    private final Map<MeetingStatus, Set<MeetingStatus>> validTransitions = new EnumMap<>(MeetingStatus.class);

    public MeetingStateMachine() {
        validTransitions.put(MeetingStatus.SCHEDULED, EnumSet.of(MeetingStatus.CONFIRMED, MeetingStatus.CHECKED_IN, MeetingStatus.CANCELLED));
        validTransitions.put(MeetingStatus.CONFIRMED, EnumSet.of(MeetingStatus.CHECKED_IN, MeetingStatus.CANCELLED));
        validTransitions.put(MeetingStatus.CHECKED_IN, EnumSet.of(MeetingStatus.IN_PROGRESS, MeetingStatus.PAUSED, MeetingStatus.COMPLETED));
        validTransitions.put(MeetingStatus.IN_PROGRESS, EnumSet.of(MeetingStatus.PAUSED, MeetingStatus.COMPLETED));
        validTransitions.put(MeetingStatus.PAUSED, EnumSet.of(MeetingStatus.CONFIRMED, MeetingStatus.CHECKED_IN, MeetingStatus.IN_PROGRESS, MeetingStatus.COMPLETED, MeetingStatus.CANCELLED));
        validTransitions.put(MeetingStatus.COMPLETED, EnumSet.of(MeetingStatus.REOPENED));
        validTransitions.put(MeetingStatus.REOPENED, EnumSet.of(MeetingStatus.CONFIRMED, MeetingStatus.CHECKED_IN, MeetingStatus.IN_PROGRESS, MeetingStatus.COMPLETED, MeetingStatus.CANCELLED));
        validTransitions.put(MeetingStatus.CANCELLED, EnumSet.noneOf(MeetingStatus.class));
    }

    public boolean canTransition(MeetingStatus from, MeetingStatus to) {
        Set<MeetingStatus> allowed = validTransitions.get(from);
        return allowed != null && allowed.contains(to);
    }

    public void validateTransition(MeetingStatus from, MeetingStatus to) {
        if (!canTransition(from, to)) {
            throw new BadRequestException("Invalid meeting status transition from " + from + " to " + to);
        }
    }
}
