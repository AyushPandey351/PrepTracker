package com.preptracker.service;

import com.preptracker.config.CacheConfig;
import com.preptracker.model.Application;
import com.preptracker.model.Application.ApplicationStatus;
import com.preptracker.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {
    
    private final ApplicationRepository applicationRepository;
    
    @Cacheable(value = CacheConfig.APPLICATIONS_CACHE, key = "'all'")
    public List<Application> getAllApplications() {
        log.debug("Fetching all applications from database");
        return applicationRepository.findAllByOrderByDateDesc();
    }
    
    @Cacheable(value = CacheConfig.APPLICATIONS_CACHE, key = "#id")
    public Application getApplicationById(String id) {
        log.debug("Fetching application by id: {}", id);
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
    }
    
    @Cacheable(value = CacheConfig.APPLICATIONS_CACHE, key = "'status_' + #status")
    public List<Application> getApplicationsByStatus(ApplicationStatus status) {
        log.debug("Fetching applications by status: {}", status);
        return applicationRepository.findByStatusOrderByDateDesc(status);
    }
    
    public List<Application> searchApplicationsByCompany(String company) {
        // Don't cache search results as they can vary
        return applicationRepository.findByCompanyContainingIgnoreCaseOrderByDateDesc(company);
    }
    
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.APPLICATIONS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public Application createApplication(Application application) {
        log.debug("Creating application for: {}", application.getCompany());
        application.setCreatedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());
        return applicationRepository.save(application);
    }
    
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.APPLICATIONS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public Application updateApplication(String id, Application applicationUpdates) {
        log.debug("Updating application: {}", id);
        Application existingApplication = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        
        if (applicationUpdates.getCompany() != null) {
            existingApplication.setCompany(applicationUpdates.getCompany());
        }
        if (applicationUpdates.getRole() != null) {
            existingApplication.setRole(applicationUpdates.getRole());
        }
        if (applicationUpdates.getStatus() != null) {
            existingApplication.setStatus(applicationUpdates.getStatus());
        }
        if (applicationUpdates.getDate() != null) {
            existingApplication.setDate(applicationUpdates.getDate());
        }
        if (applicationUpdates.getNotes() != null) {
            existingApplication.setNotes(applicationUpdates.getNotes());
        }
        if (applicationUpdates.getUrl() != null) {
            existingApplication.setUrl(applicationUpdates.getUrl());
        }
        
        existingApplication.setUpdatedAt(LocalDateTime.now());
        return applicationRepository.save(existingApplication);
    }
    
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.APPLICATIONS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public Application updateApplicationStatus(String id, ApplicationStatus status) {
        log.debug("Updating application status: {} -> {}", id, status);
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        application.setStatus(status);
        application.setUpdatedAt(LocalDateTime.now());
        return applicationRepository.save(application);
    }
    
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.APPLICATIONS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public void deleteApplication(String id) {
        log.debug("Deleting application: {}", id);
        applicationRepository.deleteById(id);
    }
    
    public long countByStatus(ApplicationStatus status) {
        return applicationRepository.countByStatus(status);
    }
}
