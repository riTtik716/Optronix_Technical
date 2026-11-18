package com.optronix.salesmgmt.modules.meeting.repository;

import com.optronix.salesmgmt.modules.meeting.entity.MeetingAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingAuditLogRepository extends JpaRepository<MeetingAuditLog, Long> {

    List<MeetingAuditLog> findByMeetingIdOrderByTimestampDesc(Long meetingId);
}
