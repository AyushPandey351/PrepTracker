package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "activity_logs")
public class ActivityLog {
    
    @Id
    private String id;
    
    @Indexed
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
    private ActivityType type = ActivityType.TOPIC_COMPLETED;
    
    public enum ActivityType {
        TOPIC_COMPLETED,
        ITEM_ADDED,
        CHECKLIST_COMPLETED,
        APPLICATION_ADDED,
        APPLICATION_STATUS_CHANGED
    }
}

