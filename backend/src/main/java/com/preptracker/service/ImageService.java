package com.preptracker.service;

import com.preptracker.model.ImageAttachment;
import com.preptracker.repository.ImageAttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    private Path uploadPath;

    @Autowired
    private ImageAttachmentRepository imageAttachmentRepository;

    @PostConstruct
    public void init() {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDir, e);
        }
    }

    public ImageAttachment uploadImage(MultipartFile file, String itemId) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("image/gif"))) {
            throw new IllegalArgumentException("Only image files (including GIFs) are allowed");
        }

        // Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;

        // Save file to disk
        Path targetPath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Save metadata to database
        ImageAttachment attachment = ImageAttachment.builder()
                .itemId(itemId)
                .fileName(fileName)
                .originalFileName(originalFileName)
                .contentType(contentType)
                .fileSize(file.getSize())
                .filePath(targetPath.toString())
                .uploadedAt(LocalDateTime.now())
                .build();

        return imageAttachmentRepository.save(attachment);
    }

    public List<ImageAttachment> getImagesByItemId(String itemId) {
        return imageAttachmentRepository.findByItemIdOrderByUploadedAtAsc(itemId);
    }

    public Resource loadImage(String fileName) throws MalformedURLException {
        Path filePath = uploadPath.resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("Image not found: " + fileName);
        }
    }

    public void deleteImage(String imageId) throws IOException {
        ImageAttachment attachment = imageAttachmentRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found: " + imageId));

        // Delete file from disk
        Path filePath = Paths.get(attachment.getFilePath());
        Files.deleteIfExists(filePath);

        // Delete metadata from database
        imageAttachmentRepository.delete(attachment);
    }

    public void deleteImagesByItemId(String itemId) throws IOException {
        List<ImageAttachment> attachments = imageAttachmentRepository.findByItemIdOrderByUploadedAtAsc(itemId);
        
        for (ImageAttachment attachment : attachments) {
            Path filePath = Paths.get(attachment.getFilePath());
            Files.deleteIfExists(filePath);
        }
        
        imageAttachmentRepository.deleteByItemId(itemId);
    }
}

