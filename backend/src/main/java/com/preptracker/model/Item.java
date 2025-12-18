package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "items")
public class Item {
    
    @Id
    private String id;
    
    @NotBlank(message = "Item title is required")
    private String title;
    
    @Builder.Default
    private Boolean completed = false;
    
    private String content;
    
    private String code;
    
    @Builder.Default
    private String codeLanguage = "javascript";
    
    @Indexed
    private String tabId;
    
    @Indexed
    private String subtopicId;
    
    private Integer sortOrder;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private LocalDateTime completedAt;
}

