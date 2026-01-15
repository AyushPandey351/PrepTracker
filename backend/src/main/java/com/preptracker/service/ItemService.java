package com.preptracker.service;

import com.preptracker.config.CacheConfig;
import com.preptracker.dto.ReorderRequest;
import com.preptracker.model.ActivityLog;
import com.preptracker.model.Item;
import com.preptracker.model.Subtopic;
import com.preptracker.model.Tab;
import com.preptracker.repository.ActivityLogRepository;
import com.preptracker.repository.ItemRepository;
import com.preptracker.repository.SubtopicRepository;
import com.preptracker.repository.TabRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemService {
    
    private final ItemRepository itemRepository;
    private final TabRepository tabRepository;
    private final SubtopicRepository subtopicRepository;
    private final ActivityLogRepository activityLogRepository;
    
    @Cacheable(value = CacheConfig.ITEMS_CACHE, key = "'all'")
    public List<Item> getAllItems() {
        log.debug("Fetching all items from database");
        return itemRepository.findAll();
    }
    
    @Cacheable(value = CacheConfig.ITEM_CACHE, key = "#id")
    public Item getItemById(String id) {
        log.debug("Fetching item by id: {}", id);
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }
    
    @Cacheable(value = CacheConfig.ITEMS_CACHE, key = "'tab_' + #tabId")
    public List<Item> getItemsByTabId(String tabId) {
        log.debug("Fetching items for tab: {}", tabId);
        return itemRepository.findByTabIdAndSubtopicIdIsNullOrderBySortOrderAsc(tabId);
    }
    
    @Cacheable(value = CacheConfig.ITEMS_CACHE, key = "'subtopic_' + #subtopicId")
    public List<Item> getItemsBySubtopicId(String subtopicId) {
        log.debug("Fetching items for subtopic: {}", subtopicId);
        return itemRepository.findBySubtopicIdOrderBySortOrderAsc(subtopicId);
    }
    
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.ITEMS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.SUBTOPICS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public Item createItem(Item item) {
        log.debug("Creating new item: {}", item.getTitle());
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        
        if (item.getSortOrder() == null) {
            long count;
            if (item.getSubtopicId() != null) {
                count = itemRepository.countBySubtopicId(item.getSubtopicId());
            } else {
                count = itemRepository.countByTabId(item.getTabId());
            }
            item.setSortOrder((int) count);
        }
        
        return itemRepository.save(item);
    }
    
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.ITEM_CACHE, key = "#id"),
            @CacheEvict(value = CacheConfig.ITEMS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.SUBTOPICS_CACHE, allEntries = true)
    })
    public Item updateItem(String id, Item itemUpdates) {
        log.debug("Updating item: {}", id);
        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        
        if (itemUpdates.getTitle() != null) {
            existingItem.setTitle(itemUpdates.getTitle());
        }
        if (itemUpdates.getContent() != null) {
            existingItem.setContent(itemUpdates.getContent());
        }
        if (itemUpdates.getCode() != null) {
            existingItem.setCode(itemUpdates.getCode());
        }
        if (itemUpdates.getCodeLanguage() != null) {
            existingItem.setCodeLanguage(itemUpdates.getCodeLanguage());
        }
        if (itemUpdates.getSortOrder() != null) {
            existingItem.setSortOrder(itemUpdates.getSortOrder());
        }
        
        existingItem.setUpdatedAt(LocalDateTime.now());
        return itemRepository.save(existingItem);
    }
    
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.ITEM_CACHE, key = "#id"),
            @CacheEvict(value = CacheConfig.ITEMS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.SUBTOPICS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.ACTIVITY_CACHE, allEntries = true)
    })
    public Item toggleItemCompletion(String id) {
        log.debug("Toggling completion for item: {}", id);
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        boolean wasCompleted = Boolean.TRUE.equals(item.getCompleted());
        
        item.setCompleted(!wasCompleted);
        item.setUpdatedAt(LocalDateTime.now());
        
        if (!wasCompleted) {
            // Item is being completed - log activity
            item.setCompletedAt(LocalDateTime.now());
            logItemCompletion(item);
        } else {
            // Item is being uncompleted
            item.setCompletedAt(null);
        }
        
        return itemRepository.save(item);
    }
    
    private void logItemCompletion(Item item) {
        Tab tab = tabRepository.findById(item.getTabId()).orElse(null);
        Subtopic subtopic = null;
        if (item.getSubtopicId() != null) {
            subtopic = subtopicRepository.findById(item.getSubtopicId()).orElse(null);
        }
        
        ActivityLog log = ActivityLog.builder()
                .date(LocalDate.now())
                .timestamp(LocalDateTime.now())
                .tabId(item.getTabId())
                .tabName(tab != null ? tab.getName() : null)
                .tabColor(tab != null ? tab.getColor() : null)
                .subtopicId(item.getSubtopicId())
                .subtopicName(subtopic != null ? subtopic.getName() : null)
                .itemId(item.getId())
                .itemTitle(item.getTitle())
                .type(ActivityLog.ActivityType.TOPIC_COMPLETED)
                .build();
        
        activityLogRepository.save(log);
    }
    
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.ITEM_CACHE, key = "#id"),
            @CacheEvict(value = CacheConfig.ITEMS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.SUBTOPICS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.ACTIVITY_CACHE, allEntries = true)
    })
    public void deleteItem(String id) {
        log.debug("Deleting item: {}", id);
        // Delete related activity logs
        activityLogRepository.deleteByItemId(id);
        // Delete the item
        itemRepository.deleteById(id);
    }
    
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.ITEMS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.SUBTOPICS_CACHE, allEntries = true)
    })
    public void reorderItems(List<ReorderRequest> updates) {
        log.debug("Reordering {} items", updates.size());
        for (ReorderRequest update : updates) {
            itemRepository.findById(update.getId()).ifPresent(item -> {
                item.setSortOrder(update.getSortOrder());
                itemRepository.save(item);
            });
        }
    }
}
