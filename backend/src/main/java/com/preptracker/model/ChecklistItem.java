package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "checklist_items")
public class ChecklistItem {
    
    @Id
    private String id;
    
    @NotBlank(message = "Text is required")
    private String text;
    
    @Builder.Default
    private Boolean completed = false;
    
    private Integer sortOrder;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime completedAt;
}

