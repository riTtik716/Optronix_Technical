package com.optronix.salesmgmt.modules.auth.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        UserProfileDto user
) {
    public static AuthResponse of(String accessToken, String refreshToken, long expiresInMs, UserProfileDto user) {
        return new AuthResponse(accessToken, refreshToken, "Bearer", expiresInMs / 1000, user);
    }
}
