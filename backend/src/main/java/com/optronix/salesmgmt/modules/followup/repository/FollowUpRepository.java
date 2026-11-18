package com.optronix.salesmgmt.modules.followup.repository;

import com.optronix.salesmgmt.modules.followup.entity.FollowUp;
import com.optronix.salesmgmt.modules.followup.entity.FollowUpStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {

    List<FollowUp> findByMeetingId(Long meetingId);

    List<FollowUp> findByOwnerId(Long ownerId);

    List<FollowUp> findByOwnerEmail(String email);

    default List<FollowUp> findByOwnerUsername(String username) {
        return findByOwnerEmail(username);
    }

    List<FollowUp> findByStatus(FollowUpStatus status);
}
