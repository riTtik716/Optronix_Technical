package com.optronix.salesmgmt.modules.auth.controller;

import com.optronix.salesmgmt.modules.auth.dto.*;
import com.optronix.salesmgmt.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest refreshRequest) {
        TokenRefreshResponse response = authService.refreshToken(refreshRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null) {
            authService.logout(userDetails.getUsername());
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileDto user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/sales-employees")
    public ResponseEntity<List<UserProfileDto>> getSalesEmployees() {
        return ResponseEntity.ok(authService.getSalesEmployees());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileDto> createUser(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return new ResponseEntity<>(response.user(), HttpStatus.CREATED);
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails adminDetails) {
        authService.deleteUser(userId, adminDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "User ID " + userId + " deleted successfully"));
    }

    @PutMapping("/users/{userId}/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> changeUserPassword(
            @PathVariable Long userId,
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails adminDetails) {
        authService.changeUserPassword(userId, request.getNewPassword(), adminDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Password updated successfully for user ID " + userId));
    }

    @PostMapping("/activity")
    public ResponseEntity<Void> logActivity(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null) {
            String activityType = body.getOrDefault("activityType", "DASHBOARD_CLOSED");
            String details = body.getOrDefault("details", "User activity recorded");
            authService.logUserActivity(userDetails.getUsername(), activityType, details);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/activities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserActivityDto>> getUserActivities() {
        return ResponseEntity.ok(authService.getUserActivities());
    }
}
