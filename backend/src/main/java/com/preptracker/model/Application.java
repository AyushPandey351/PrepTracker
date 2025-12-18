package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "applications")
public class Application {
    
    @Id
    private String id;
    
    @NotBlank(message = "Company name is required")
    private String company;
    
    private String role;
    
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;
    
    private LocalDate date;
    
    private String notes;
    
    private String url;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    public enum ApplicationStatus {
        APPLIED,
        INTERVIEW,
        OFFERED,
        REJECTED,
        WITHDRAWN
    }
}

