package com.optronix.salesmgmt.modules.auth.dto;

public record TokenRefreshResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn
) {
    public static TokenRefreshResponse of(String accessToken, String refreshToken, long expiresInMs) {
        return new TokenRefreshResponse(accessToken, refreshToken, "Bearer", expiresInMs / 1000);
    }
}
