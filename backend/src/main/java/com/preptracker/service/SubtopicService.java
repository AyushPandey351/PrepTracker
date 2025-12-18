package com.preptracker.service;

import com.preptracker.config.CacheConfig;
import com.preptracker.dto.SubtopicWithItems;
import com.preptracker.model.Item;
import com.preptracker.model.Subtopic;
import com.preptracker.repository.ItemRepository;
import com.preptracker.repository.SubtopicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubtopicService {
    
    private final SubtopicRepository subtopicRepository;
    private final ItemRepository itemRepository;
    
    @Cacheable(value = CacheConfig.SUBTOPICS_CACHE, key = "#tabId")
    public List<Subtopic> getSubtopicsByTabId(String tabId) {
        log.debug("Fetching subtopics for tab: {}", tabId);
        return subtopicRepository.findByTabIdOrderBySortOrderAsc(tabId);
    }
    
    @Cacheable(value = CacheConfig.SUBTOPIC_CACHE, key = "#id")
    public Subtopic getSubtopicById(String id) {
        log.debug("Fetching subtopic by id: {}", id);
        return subtopicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subtopic not found with id: " + id));
    }
    
    public SubtopicWithItems getSubtopicWithItems(String subtopicId) {
        Subtopic subtopic = getSubtopicById(subtopicId);
        List<Item> items = itemRepository.findBySubtopicIdOrderBySortOrderAsc(subtopicId);
        return SubtopicWithItems.from(subtopic, items);
    }
    
    public List<SubtopicWithItems> getSubtopicsWithItemsByTabId(String tabId) {
        List<Subtopic> subtopics = getSubtopicsByTabId(tabId);
        return subtopics.stream()
                .map(subtopic -> {
                    List<Item> items = itemRepository.findBySubtopicIdOrderBySortOrderAsc(subtopic.getId());
                    return SubtopicWithItems.from(subtopic, items);
                })
                .collect(Collectors.toList());
    }
    
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.SUBTOPICS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public Subtopic createSubtopic(Subtopic subtopic) {
        log.debug("Creating subtopic: {}", subtopic.getName());
        if (subtopic.getSortOrder() == null) {
            long count = subtopicRepository.countByTabId(subtopic.getTabId());
            subtopic.setSortOrder((int) count);
        }
        return subtopicRepository.save(subtopic);
    }
    
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.SUBTOPIC_CACHE, key = "#id"),
            @CacheEvict(value = CacheConfig.SUBTOPICS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public Subtopic updateSubtopic(String id, Subtopic subtopicUpdates) {
        log.debug("Updating subtopic: {}", id);
        Subtopic existingSubtopic = subtopicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subtopic not found with id: " + id));
        
        if (subtopicUpdates.getName() != null) {
            existingSubtopic.setName(subtopicUpdates.getName());
        }
        if (subtopicUpdates.getColor() != null) {
            existingSubtopic.setColor(subtopicUpdates.getColor());
        }
        if (subtopicUpdates.getSortOrder() != null) {
            existingSubtopic.setSortOrder(subtopicUpdates.getSortOrder());
        }
        
        return subtopicRepository.save(existingSubtopic);
    }
    
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.SUBTOPIC_CACHE, key = "#id"),
            @CacheEvict(value = CacheConfig.SUBTOPICS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.ITEMS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public void deleteSubtopic(String id) {
        log.debug("Deleting subtopic: {}", id);
        // Delete all items under this subtopic
        itemRepository.deleteBySubtopicId(id);
        // Delete the subtopic
        subtopicRepository.deleteById(id);
    }
    
    public int calculateSubtopicProgress(String subtopicId) {
        long total = itemRepository.countBySubtopicId(subtopicId);
        long completed = itemRepository.countBySubtopicIdAndCompletedTrue(subtopicId);
        return total > 0 ? (int) (completed * 100 / total) : 0;
    }
}
