package com.preptracker.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
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

    @Value("${spring.cache.type:caffeine}")
    private String cacheType;

    /**
     * Primary cache manager using Caffeine (in-memory cache)
     * This is fast and doesn't require external dependencies
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
                DASHBOARD_CACHE, ACTIVITY_CACHE
        ));
        
        return cacheManager;
    }

    /**
     * Redis cache manager for distributed caching
     * Use this when running multiple instances
     */
    @Bean
    public CacheManager redisCacheManager(RedisConnectionFactory connectionFactory) {
        // Default configuration
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        // Per-cache configurations with different TTLs
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Tabs cache - longer TTL since they don't change often
        cacheConfigurations.put(TABS_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigurations.put(TAB_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(30)));
        cacheConfigurations.put(TAB_DATA_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Subtopics cache
        cacheConfigurations.put(SUBTOPICS_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigurations.put(SUBTOPIC_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // Items cache - shorter TTL since they change more often
        cacheConfigurations.put(ITEMS_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(5)));
        cacheConfigurations.put(ITEM_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Checklist cache
        cacheConfigurations.put(CHECKLIST_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(10)));
        
        // Applications cache
        cacheConfigurations.put(APPLICATIONS_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // Dashboard cache - shorter TTL for fresh stats
        cacheConfigurations.put(DASHBOARD_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(2)));
        
        // Activity cache
        cacheConfigurations.put(ACTIVITY_CACHE, defaultConfig.entryTtl(Duration.ofMinutes(5)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}

