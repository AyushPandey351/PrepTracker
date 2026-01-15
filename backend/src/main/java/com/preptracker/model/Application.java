package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "applications")
public class Application {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Company name is required")
    private String company;
    
    private String role;
    
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.APPLIED;
    
    private LocalDate date;
    
    @Column(columnDefinition = "TEXT")
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
