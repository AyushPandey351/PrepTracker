package com.preptracker.controller;

import com.preptracker.model.ActivityLog;
import com.preptracker.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ActivityLogController {
    
    private final ActivityLogService activityLogService;
    
    @GetMapping
    public ResponseEntity<List<ActivityLog>> getAllActivityLogs() {
        return ResponseEntity.ok(activityLogService.getAllActivityLogs());
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<List<ActivityLog>> getActivityLogsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(activityLogService.getActivityLogsByDate(date));
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<ActivityLog>> getActivityLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(activityLogService.getActivityLogsByDateRange(startDate, endDate));
    }
    
    @GetMapping("/tab/{tabId}")
    public ResponseEntity<List<ActivityLog>> getActivityLogsByTabId(@PathVariable String tabId) {
        return ResponseEntity.ok(activityLogService.getActivityLogsByTabId(tabId));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivityLog(@PathVariable String id) {
        activityLogService.deleteActivityLog(id);
        return ResponseEntity.noContent().build();
    }
}

