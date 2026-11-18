package com.optronix.salesmgmt.modules.auth.dto;

import com.optronix.salesmgmt.modules.auth.entity.UserActivityLog;
import java.time.LocalDateTime;

public record UserActivityDto(
        Long id,
        Long userId,
        String userName,
        String userEmail,
        String activityType,
        String details,
        LocalDateTime timestamp
) {
    public static UserActivityDto fromEntity(UserActivityLog log) {
        return new UserActivityDto(
                log.getId(),
                log.getUser() != null ? log.getUser().getId() : null,
                log.getUser() != null ? log.getUser().getName() : "Unknown",
                log.getUser() != null ? log.getUser().getEmail() : "Unknown",
                log.getActivityType(),
                log.getDetails(),
                log.getTimestamp()
        );
    }
}
