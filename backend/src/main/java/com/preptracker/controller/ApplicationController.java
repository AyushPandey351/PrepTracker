package com.preptracker.controller;

import com.preptracker.model.Application;
import com.preptracker.model.Application.ApplicationStatus;
import com.preptracker.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApplicationController {
    
    private final ApplicationService applicationService;
    
    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable String id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Application>> getApplicationsByStatus(@PathVariable ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.getApplicationsByStatus(status));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Application>> searchApplications(@RequestParam String company) {
        return ResponseEntity.ok(applicationService.searchApplicationsByCompany(company));
    }
    
    @PostMapping
    public ResponseEntity<Application> createApplication(@Valid @RequestBody Application application) {
        Application createdApplication = applicationService.createApplication(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdApplication);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(@PathVariable String id, @RequestBody Application application) {
        return ResponseEntity.ok(applicationService.updateApplication(id, application));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable String id, 
            @RequestBody Map<String, String> statusUpdate) {
        ApplicationStatus status = ApplicationStatus.valueOf(statusUpdate.get("status").toUpperCase());
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable String id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}

