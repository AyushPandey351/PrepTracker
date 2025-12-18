package com.preptracker.controller;

import com.preptracker.service.CacheService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cache")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CacheController {
    
    private final CacheService cacheService;
    
    /**
     * Clear all caches
     */
    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearAllCaches() {
        cacheService.clearAllCaches();
        return ResponseEntity.ok(Map.of("message", "All caches cleared successfully"));
    }
    
    /**
     * Clear a specific cache by name
     */
    @DeleteMapping("/{cacheName}")
    public ResponseEntity<Map<String, String>> clearCache(@PathVariable String cacheName) {
        cacheService.clearCache(cacheName);
        return ResponseEntity.ok(Map.of("message", "Cache '" + cacheName + "' cleared successfully"));
    }
    
    /**
     * Clear all tab-related caches
     */
    @DeleteMapping("/tabs")
    public ResponseEntity<Map<String, String>> clearTabCaches() {
        cacheService.clearTabCaches();
        return ResponseEntity.ok(Map.of("message", "Tab caches cleared successfully"));
    }
    
    /**
     * Clear all item-related caches
     */
    @DeleteMapping("/items")
    public ResponseEntity<Map<String, String>> clearItemCaches() {
        cacheService.clearItemCaches();
        return ResponseEntity.ok(Map.of("message", "Item caches cleared successfully"));
    }
}

