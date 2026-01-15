package com.preptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "alive");
        response.put("timestamp", LocalDateTime.now().toString());
        
        // Ping H2 Database to keep connection warm
        try (Connection conn = dataSource.getConnection()) {
            conn.isValid(5);
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
        response.put("database", "H2 (Local)");
        
        // Check H2 connection
        try (Connection conn = dataSource.getConnection()) {
            conn.isValid(5);
            response.put("dbStatus", "UP");
        } catch (Exception e) {
            response.put("dbStatus", "DOWN");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}
