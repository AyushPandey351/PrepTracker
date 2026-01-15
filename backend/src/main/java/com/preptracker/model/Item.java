package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "items", indexes = {
    @Index(name = "idx_item_tab", columnList = "tabId"),
    @Index(name = "idx_item_subtopic", columnList = "subtopicId")
})
public class Item {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Item title is required")
    private String title;
    
    @Builder.Default
    private Boolean completed = false;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(columnDefinition = "TEXT")
    private String code;
    
    @Builder.Default
    private String codeLanguage = "javascript";
    
    private String tabId;
    
    private String subtopicId;
    
    private Integer sortOrder;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private LocalDateTime completedAt;
    
    // Image paths stored as comma-separated values
    @Column(columnDefinition = "TEXT")
    private String images;
}
