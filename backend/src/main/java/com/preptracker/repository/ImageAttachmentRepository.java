package com.preptracker.repository;

import com.preptracker.model.ImageAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ImageAttachmentRepository extends JpaRepository<ImageAttachment, String> {
    
    List<ImageAttachment> findByItemIdOrderByUploadedAtAsc(String itemId);
    
    @Modifying
    @Transactional
    void deleteByItemId(String itemId);
}

