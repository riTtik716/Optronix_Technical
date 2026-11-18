package com.optronix.salesmgmt.modules.auth.dto;

import com.optronix.salesmgmt.modules.auth.entity.Role;
import com.optronix.salesmgmt.modules.auth.entity.User;

import java.time.LocalDateTime;

public record UserProfileDto(
        Long id,
        String name,
        String email,
        Role role,
        Long managerId,
        String managerName,
        LocalDateTime lastLoginAt,
        LocalDateTime lastLogoutAt
) {
    public static UserProfileDto fromEntity(User user) {
        return fromEntity(user, null);
    }

    public static UserProfileDto fromEntity(User user, String managerName) {
        return new UserProfileDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getManagerId(),
                managerName,
                user.getLastLoginAt(),
                user.getLastLogoutAt()
        );
    }
}
