package com.preptracker.service;

import com.preptracker.config.CacheConfig;
import com.preptracker.model.ActivityLog;
import com.preptracker.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityLogService {
    
    private final ActivityLogRepository activityLogRepository;
    
    @Cacheable(value = CacheConfig.ACTIVITY_CACHE, key = "'all'")
    public List<ActivityLog> getAllActivityLogs() {
        log.debug("Fetching all activity logs from database");
        return activityLogRepository.findAllByOrderByTimestampDesc();
    }
    
    @Cacheable(value = CacheConfig.ACTIVITY_CACHE, key = "'date_' + #date")
    public List<ActivityLog> getActivityLogsByDate(LocalDate date) {
        log.debug("Fetching activity logs for date: {}", date);
        return activityLogRepository.findByDateOrderByTimestampDesc(date);
    }
    
    public List<ActivityLog> getActivityLogsByDateRange(LocalDate startDate, LocalDate endDate) {
        // Don't cache range queries as they can vary
        return activityLogRepository.findByDateBetweenOrderByTimestampDesc(startDate, endDate);
    }
    
    @Cacheable(value = CacheConfig.ACTIVITY_CACHE, key = "'tab_' + #tabId")
    public List<ActivityLog> getActivityLogsByTabId(String tabId) {
        log.debug("Fetching activity logs for tab: {}", tabId);
        return activityLogRepository.findByTabIdOrderByTimestampDesc(tabId);
    }
    
    @CacheEvict(value = CacheConfig.ACTIVITY_CACHE, allEntries = true)
    public ActivityLog createActivityLog(ActivityLog activityLog) {
        log.debug("Creating activity log");
        return activityLogRepository.save(activityLog);
    }
    
    @CacheEvict(value = CacheConfig.ACTIVITY_CACHE, allEntries = true)
    public void deleteActivityLog(String id) {
        log.debug("Deleting activity log: {}", id);
        activityLogRepository.deleteById(id);
    }
    
    public long countByDate(LocalDate date) {
        return activityLogRepository.countByDate(date);
    }
}
