package com.preptracker.controller;

import com.preptracker.model.ImageAttachment;
import com.preptracker.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    /**
     * Upload an image for an item
     */
    @PostMapping("/upload")
    public ResponseEntity<ImageAttachment> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("itemId") String itemId) {
        try {
            ImageAttachment attachment = imageService.uploadImage(file, itemId);
            return ResponseEntity.ok(attachment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Upload multiple images for an item
     */
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<ImageAttachment>> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("itemId") String itemId) {
        try {
            List<ImageAttachment> attachments = new java.util.ArrayList<>();
            for (MultipartFile file : files) {
                attachments.add(imageService.uploadImage(file, itemId));
            }
            return ResponseEntity.ok(attachments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all images for an item
     */
    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ImageAttachment>> getImagesByItem(@PathVariable String itemId) {
        List<ImageAttachment> attachments = imageService.getImagesByItemId(itemId);
        return ResponseEntity.ok(attachments);
    }

    /**
     * Serve an image file
     */
    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        try {
            Resource resource = imageService.loadImage(fileName);
            
            // Determine content type
            String contentType = "application/octet-stream";
            if (fileName.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (fileName.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            } else if (fileName.toLowerCase().endsWith(".webp")) {
                contentType = "image/webp";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete an image
     */
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Map<String, String>> deleteImage(@PathVariable String imageId) {
        try {
            imageService.deleteImage(imageId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Image deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}

