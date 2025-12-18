package com.preptracker.service;

import com.preptracker.config.CacheConfig;
import com.preptracker.model.ChecklistItem;
import com.preptracker.repository.ChecklistItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChecklistService {
    
    private final ChecklistItemRepository checklistItemRepository;
    
    @Cacheable(value = CacheConfig.CHECKLIST_CACHE, key = "'all'")
    public List<ChecklistItem> getAllChecklistItems() {
        log.debug("Fetching all checklist items from database");
        return checklistItemRepository.findAllByOrderBySortOrderAsc();
    }
    
    @Cacheable(value = CacheConfig.CHECKLIST_CACHE, key = "#id")
    public ChecklistItem getChecklistItemById(String id) {
        log.debug("Fetching checklist item by id: {}", id);
        return checklistItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checklist item not found with id: " + id));
    }
    
    @CacheEvict(value = CacheConfig.CHECKLIST_CACHE, allEntries = true)
    public ChecklistItem createChecklistItem(ChecklistItem item) {
        log.debug("Creating checklist item: {}", item.getText());
        item.setCreatedAt(LocalDateTime.now());
        if (item.getSortOrder() == null) {
            long count = checklistItemRepository.count();
            item.setSortOrder((int) count);
        }
        return checklistItemRepository.save(item);
    }
    
    @CacheEvict(value = CacheConfig.CHECKLIST_CACHE, allEntries = true)
    public ChecklistItem updateChecklistItem(String id, ChecklistItem itemUpdates) {
        log.debug("Updating checklist item: {}", id);
        ChecklistItem existingItem = checklistItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checklist item not found with id: " + id));
        
        if (itemUpdates.getText() != null) {
            existingItem.setText(itemUpdates.getText());
        }
        if (itemUpdates.getSortOrder() != null) {
            existingItem.setSortOrder(itemUpdates.getSortOrder());
        }
        
        return checklistItemRepository.save(existingItem);
    }
    
    @CacheEvict(value = CacheConfig.CHECKLIST_CACHE, allEntries = true)
    public ChecklistItem toggleChecklistItem(String id) {
        log.debug("Toggling checklist item: {}", id);
        ChecklistItem item = checklistItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checklist item not found with id: " + id));
        boolean wasCompleted = Boolean.TRUE.equals(item.getCompleted());
        
        item.setCompleted(!wasCompleted);
        
        if (!wasCompleted) {
            item.setCompletedAt(LocalDateTime.now());
        } else {
            item.setCompletedAt(null);
        }
        
        return checklistItemRepository.save(item);
    }
    
    @CacheEvict(value = CacheConfig.CHECKLIST_CACHE, allEntries = true)
    public void deleteChecklistItem(String id) {
        log.debug("Deleting checklist item: {}", id);
        checklistItemRepository.deleteById(id);
    }
}
