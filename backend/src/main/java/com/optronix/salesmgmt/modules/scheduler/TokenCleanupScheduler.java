package com.optronix.salesmgmt.modules.scheduler;

import com.optronix.salesmgmt.modules.auth.repository.RefreshTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Component
public class TokenCleanupScheduler {

    private static final Logger log = LoggerFactory.getLogger(TokenCleanupScheduler.class);

    private final RefreshTokenRepository refreshTokenRepository;

    public TokenCleanupScheduler(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    /**
     * Purge expired refresh tokens daily at midnight (or every 6 hours)
     */
    @Scheduled(cron = "0 0 */6 * * *")
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Starting scheduled cleanup of expired refresh tokens...");
        int deletedCount = refreshTokenRepository.deleteByExpiryDateBefore(Instant.now());
        log.info("Finished token cleanup. Deleted {} expired tokens.", deletedCount);
    }
}
