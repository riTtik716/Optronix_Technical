package com.optronix.salesmgmt.modules.auth.service;

import com.optronix.salesmgmt.modules.auth.dto.*;

import java.util.List;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse register(RegisterRequest registerRequest);
    TokenRefreshResponse refreshToken(TokenRefreshRequest refreshRequest);
    void logout(String email);
    UserProfileDto getCurrentUser(String email);
    List<UserProfileDto> getSalesEmployees();
    List<UserProfileDto> getAllUsers();
    void changeUserPassword(Long userId, String newPassword, String adminEmail);
    void deleteUser(Long userId, String adminEmail);
    void logUserActivity(String email, String activityType, String details);
    List<UserActivityDto> getUserActivities();
}
