package com.preptracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "image_attachments", indexes = {
    @Index(name = "idx_image_item", columnList = "itemId")
})
public class ImageAttachment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String itemId;
    
    private String fileName;
    
    private String originalFileName;
    
    private String contentType;
    
    private Long fileSize;
    
    private String filePath;
    
    private LocalDateTime uploadedAt;
}

