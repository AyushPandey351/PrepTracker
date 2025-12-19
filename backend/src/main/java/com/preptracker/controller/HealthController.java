package com.preptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "alive");
        response.put("timestamp", LocalDateTime.now().toString());
        
        // Ping MongoDB to keep connection warm
        try {
            mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1));
            response.put("database", "connected");
        } catch (Exception e) {
            response.put("database", "error: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("service", "PrepTracker API");
        
        // Check MongoDB connection
        try {
            mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1));
            response.put("mongodb", "UP");
        } catch (Exception e) {
            response.put("mongodb", "DOWN");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}

