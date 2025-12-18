package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "subtopics")
public class Subtopic {
    
    @Id
    private String id;
    
    @NotBlank(message = "Subtopic name is required")
    private String name;
    
    private String color;
    
    @Indexed
    @NotBlank(message = "Tab ID is required")
    private String tabId;
    
    private Integer sortOrder;
}

