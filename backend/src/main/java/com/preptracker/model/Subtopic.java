package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subtopics", indexes = {
    @Index(name = "idx_subtopic_tab", columnList = "tabId")
})
public class Subtopic {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Subtopic name is required")
    private String name;
    
    private String color;
    
    @NotBlank(message = "Tab ID is required")
    private String tabId;
    
    private Integer sortOrder;
}
