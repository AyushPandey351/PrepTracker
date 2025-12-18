package com.preptracker.service;

import com.preptracker.config.CacheConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
 * Service for managing cache operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CacheService {

    private final CacheManager cacheManager;

    /**
     * Clear all caches
     */
    public void clearAllCaches() {
        log.info("Clearing all caches");
        cacheManager.getCacheNames().forEach(cacheName -> {
            Objects.requireNonNull(cacheManager.getCache(cacheName)).clear();
        });
    }

    /**
     * Clear a specific cache
     */
    public void clearCache(String cacheName) {
        log.info("Clearing cache: {}", cacheName);
        var cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        }
    }

    /**
     * Evict a specific key from a cache
     */
    public void evictFromCache(String cacheName, Object key) {
        log.debug("Evicting key {} from cache: {}", key, cacheName);
        var cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.evict(key);
        }
    }

    /**
     * Clear all tab-related caches
     */
    public void clearTabCaches() {
        clearCache(CacheConfig.TABS_CACHE);
        clearCache(CacheConfig.TAB_CACHE);
        clearCache(CacheConfig.TAB_DATA_CACHE);
        clearCache(CacheConfig.DASHBOARD_CACHE);
    }

    /**
     * Clear all subtopic-related caches
     */
    public void clearSubtopicCaches() {
        clearCache(CacheConfig.SUBTOPICS_CACHE);
        clearCache(CacheConfig.SUBTOPIC_CACHE);
        clearCache(CacheConfig.TAB_DATA_CACHE);
        clearCache(CacheConfig.DASHBOARD_CACHE);
    }

    /**
     * Clear all item-related caches
     */
    public void clearItemCaches() {
        clearCache(CacheConfig.ITEMS_CACHE);
        clearCache(CacheConfig.ITEM_CACHE);
        clearCache(CacheConfig.TAB_DATA_CACHE);
        clearCache(CacheConfig.SUBTOPICS_CACHE);
        clearCache(CacheConfig.DASHBOARD_CACHE);
        clearCache(CacheConfig.ACTIVITY_CACHE);
    }

    /**
     * Clear checklist cache
     */
    public void clearChecklistCache() {
        clearCache(CacheConfig.CHECKLIST_CACHE);
    }

    /**
     * Clear applications cache
     */
    public void clearApplicationsCache() {
        clearCache(CacheConfig.APPLICATIONS_CACHE);
        clearCache(CacheConfig.DASHBOARD_CACHE);
    }
}

