package com.preptracker.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    public static final String TABS_CACHE = "tabs";
    public static final String TAB_CACHE = "tab";
    public static final String TAB_DATA_CACHE = "tabData";
    public static final String SUBTOPICS_CACHE = "subtopics";
    public static final String SUBTOPIC_CACHE = "subtopic";
    public static final String ITEMS_CACHE = "items";
    public static final String ITEM_CACHE = "item";
    public static final String CHECKLIST_CACHE = "checklist";
    public static final String APPLICATIONS_CACHE = "applications";
    public static final String DASHBOARD_CACHE = "dashboard";
    public static final String ACTIVITY_CACHE = "activity";
    public static final String IMAGES_CACHE = "images";

    /**
     * Cache manager using Caffeine (in-memory cache)
     * Fast and doesn't require external dependencies
     */
    @Bean
    @Primary
    public CacheManager caffeineCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        
        // Default cache configuration
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .recordStats());
        
        // Register cache names
        cacheManager.setCacheNames(java.util.List.of(
                TABS_CACHE, TAB_CACHE, TAB_DATA_CACHE,
                SUBTOPICS_CACHE, SUBTOPIC_CACHE,
                ITEMS_CACHE, ITEM_CACHE,
                CHECKLIST_CACHE, APPLICATIONS_CACHE,
                DASHBOARD_CACHE, ACTIVITY_CACHE,
                IMAGES_CACHE
        ));
        
        return cacheManager;
    }
}
