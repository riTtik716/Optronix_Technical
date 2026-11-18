package com.optronix.salesmgmt.modules.meeting.repository;

import com.optronix.salesmgmt.modules.meeting.entity.MeetingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingSessionRepository extends JpaRepository<MeetingSession, Long> {

    List<MeetingSession> findByMeetingIdOrderBySessionNumberAsc(Long meetingId);

    Optional<MeetingSession> findTopByMeetingIdOrderBySessionNumberDesc(Long meetingId);
}
