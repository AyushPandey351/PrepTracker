package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tabs")
public class Tab {
    
    @Id
    private String id;
    
    @NotBlank(message = "Tab name is required")
    private String name;
    
    private String icon;
    
    private String color;
    
    @Builder.Default
    private Boolean hasSubtopics = false;
    
    private Integer sortOrder;
}

