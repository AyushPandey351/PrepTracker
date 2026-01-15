package com.preptracker.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;

@Component
public class WarmupScheduler {

    private static final Logger logger = LoggerFactory.getLogger(WarmupScheduler.class);

    @Autowired
    private DataSource dataSource;

    /**
     * Ping the database every 10 minutes to keep connections warm
     */
    @Scheduled(fixedRate = 600000) // 10 minutes = 600,000 ms
    public void keepWarm() {
        try (Connection conn = dataSource.getConnection()) {
            conn.isValid(5);
            logger.info("Warmup ping successful at {}", LocalDateTime.now());
        } catch (Exception e) {
            logger.error("Warmup ping failed: {}", e.getMessage());
        }
    }

    /**
     * Log startup message
     */
    @Scheduled(initialDelay = 5000, fixedRate = Long.MAX_VALUE)
    public void logStartup() {
        logger.info("PrepTracker Backend started successfully at {}", LocalDateTime.now());
        logger.info("Using H2 Database (local file-based storage)");
        logger.info("Warmup scheduler is active - pinging every 10 minutes");
    }
}
