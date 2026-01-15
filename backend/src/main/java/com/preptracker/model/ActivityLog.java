package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "activity_logs", indexes = {
    @Index(name = "idx_activity_date", columnList = "date")
})
public class ActivityLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private LocalDate date;
    
    private LocalDateTime timestamp;
    
    private String tabId;
    
    private String tabName;
    
    private String tabColor;
    
    private String subtopicId;
    
    private String subtopicName;
    
    private String itemId;
    
    private String itemTitle;
    
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ActivityType type = ActivityType.TOPIC_COMPLETED;
    
    public enum ActivityType {
        TOPIC_COMPLETED,
        ITEM_ADDED,
        CHECKLIST_COMPLETED,
        HABIT_COMPLETED,
        APPLICATION_ADDED,
        APPLICATION_STATUS_CHANGED
    }
}
