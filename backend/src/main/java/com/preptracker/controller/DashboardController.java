package com.preptracker.controller;

import com.preptracker.dto.DashboardStats;
import com.preptracker.dto.FullDataExport;
import com.preptracker.service.DashboardService;
import com.preptracker.service.DataExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {
    
    private final DashboardService dashboardService;
    private final DataExportService dataExportService;
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
    
    @GetMapping("/export")
    public ResponseEntity<FullDataExport> exportAllData() {
        return ResponseEntity.ok(dataExportService.exportAllData());
    }
}

