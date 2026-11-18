package com.optronix.salesmgmt.modules.auth.service;

import com.optronix.salesmgmt.exception.BadRequestException;
import com.optronix.salesmgmt.exception.ResourceNotFoundException;
import com.optronix.salesmgmt.exception.TokenRefreshException;
import com.optronix.salesmgmt.modules.auth.dto.*;
import com.optronix.salesmgmt.modules.auth.entity.RefreshToken;
import com.optronix.salesmgmt.modules.auth.entity.Role;
import com.optronix.salesmgmt.modules.auth.entity.User;
import com.optronix.salesmgmt.modules.auth.entity.UserActivityLog;
import com.optronix.salesmgmt.modules.auth.repository.UserActivityLogRepository;
import com.optronix.salesmgmt.modules.auth.repository.UserRepository;
import com.optronix.salesmgmt.modules.auth.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserActivityLogRepository userActivityLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           UserActivityLogRepository userActivityLogRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider tokenProvider,
                           RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.userActivityLogRepository = userActivityLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password())
        );

        User user = userRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginRequest.email()));

        // Update login timestamp
        LocalDateTime now = LocalDateTime.now();
        user.setLastLoginAt(now);
        userRepository.save(user);

        // Record activity log
        userActivityLogRepository.save(new UserActivityLog(user, "LOGIN", "User logged in to portal", now));

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return AuthResponse.of(
                accessToken,
                refreshToken.getToken(),
                tokenProvider.getAccessTokenExpirationMs(),
                UserProfileDto.fromEntity(user)
        );
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.email())) {
            throw new BadRequestException("Email is already registered: " + registerRequest.email());
        }

        User user = new User(
                registerRequest.name(),
                registerRequest.email(),
                passwordEncoder.encode(registerRequest.password()),
                registerRequest.role(),
                registerRequest.managerId()
        );

        User savedUser = userRepository.save(user);

        String accessToken = tokenProvider.generateAccessToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getId());

        return AuthResponse.of(
                accessToken,
                refreshToken.getToken(),
                tokenProvider.getAccessTokenExpirationMs(),
                UserProfileDto.fromEntity(savedUser)
        );
    }

    @Override
    @Transactional
    public TokenRefreshResponse refreshToken(TokenRefreshRequest refreshRequest) {
        String requestRefreshToken = refreshRequest.refreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(refreshTokenService::rotateRefreshToken)
                .map(token -> {
                    User user = token.getUser();
                    String newAccessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
                    return TokenRefreshResponse.of(newAccessToken, token.getToken(), tokenProvider.getAccessTokenExpirationMs());
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
    }

    @Override
    @Transactional
    public void logout(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            LocalDateTime now = LocalDateTime.now();
            user.setLastLogoutAt(now);
            userRepository.save(user);
            userActivityLogRepository.save(new UserActivityLog(user, "LOGOUT", "User logged out / closed dashboard", now));
            refreshTokenService.revokeByUser(user.getId());
        });
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        String managerName = null;
        if (user.getManagerId() != null) {
            managerName = userRepository.findById(user.getManagerId()).map(User::getName).orElse(null);
        }
        return UserProfileDto.fromEntity(user, managerName);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileDto> getSalesEmployees() {
        java.util.Map<Long, String> managerNames = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_SALES_MANAGER || u.getRole() == Role.ROLE_ADMIN)
                .collect(java.util.stream.Collectors.toMap(User::getId, User::getName, (a, b) -> a));

        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_SALES_EMPLOYEE || u.getRole() == Role.ROLE_SALES_MANAGER)
                .map(u -> UserProfileDto.fromEntity(u, u.getManagerId() != null ? managerNames.get(u.getManagerId()) : null))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileDto> getAllUsers() {
        java.util.Map<Long, String> managerNames = userRepository.findAll().stream()
                .collect(java.util.stream.Collectors.toMap(User::getId, User::getName, (a, b) -> a));

        return userRepository.findAll().stream()
                .map(u -> UserProfileDto.fromEntity(u, u.getManagerId() != null ? managerNames.get(u.getManagerId()) : null))
                .toList();
    }

    @Override
    @Transactional
    public void changeUserPassword(Long userId, String newPassword, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Revoke existing refresh tokens so user is forced to re-authenticate with new password
        refreshTokenService.revokeByUser(user.getId());

        LocalDateTime now = LocalDateTime.now();
        userActivityLogRepository.save(new UserActivityLog(
                user,
                "PASSWORD_RESET",
                "Password changed by Administrator (" + adminEmail + ")",
                now
        ));
    }

    @Override
    @Transactional
    public void deleteUser(Long userId, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.getEmail().equalsIgnoreCase(adminEmail)) {
            throw new BadRequestException("Administrator cannot delete their own active account");
        }

        // Revoke tokens
        refreshTokenService.revokeByUser(user.getId());
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public void logUserActivity(String email, String activityType, String details) {
        userRepository.findByEmail(email).ifPresent(user -> {
            LocalDateTime now = LocalDateTime.now();
            if ("DASHBOARD_CLOSED".equalsIgnoreCase(activityType) || "LOGOUT".equalsIgnoreCase(activityType)) {
                user.setLastLogoutAt(now);
                userRepository.save(user);
            }
            userActivityLogRepository.save(new UserActivityLog(user, activityType, details, now));
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserActivityDto> getUserActivities() {
        return userActivityLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(UserActivityDto::fromEntity)
                .toList();
    }
}
