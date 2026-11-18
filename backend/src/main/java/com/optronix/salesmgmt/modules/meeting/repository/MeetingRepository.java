package com.optronix.salesmgmt.modules.meeting.repository;

import com.optronix.salesmgmt.modules.meeting.entity.Meeting;
import com.optronix.salesmgmt.modules.meeting.entity.MeetingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    List<Meeting> findByAssignedEmployeeId(Long assignedEmployeeId);

    List<Meeting> findByAssignedEmployeeEmail(String email);

    default List<Meeting> findByAssignedEmployeeUsername(String username) {
        return findByAssignedEmployeeEmail(username);
    }

    List<Meeting> findByStatus(MeetingStatus status);

    @Query("SELECT m FROM Meeting m WHERE (:status IS NULL OR m.status = :status) " +
           "AND (:assignedEmployeeId IS NULL OR m.assignedEmployee.id = :assignedEmployeeId) " +
           "ORDER BY m.scheduledStartTime ASC")
    List<Meeting> searchMeetings(
            @Param("status") MeetingStatus status,
            @Param("assignedEmployeeId") Long assignedEmployeeId
    );
}
