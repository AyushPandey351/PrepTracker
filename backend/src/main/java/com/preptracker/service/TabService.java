package com.preptracker.service;

import com.preptracker.config.CacheConfig;
import com.preptracker.dto.SubtopicWithItems;
import com.preptracker.dto.TabWithData;
import com.preptracker.model.Item;
import com.preptracker.model.Subtopic;
import com.preptracker.model.Tab;
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

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TabService {
    
    private final TabRepository tabRepository;
    private final SubtopicRepository subtopicRepository;
    private final ItemRepository itemRepository;
    private final CacheService cacheService;
    
    @Cacheable(value = CacheConfig.TABS_CACHE, key = "'all'")
    public List<Tab> getAllTabs() {
        log.debug("Fetching all tabs from database");
        return tabRepository.findAllByOrderBySortOrderAsc();
    }
    
    @Cacheable(value = CacheConfig.TAB_CACHE, key = "#id")
    public Tab getTabById(String id) {
        log.debug("Fetching tab by id: {}", id);
        return tabRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tab not found with id: " + id));
    }
    
    @Cacheable(value = CacheConfig.TAB_DATA_CACHE, key = "#tabId")
    public TabWithData getTabWithData(String tabId) {
        log.debug("Fetching tab with data: {}", tabId);
        Tab tab = getTabById(tabId);
        
        if (Boolean.TRUE.equals(tab.getHasSubtopics())) {
            List<Subtopic> subtopics = subtopicRepository.findByTabIdOrderBySortOrderAsc(tabId);
            List<SubtopicWithItems> subtopicsWithItems = subtopics.stream()
                    .map(subtopic -> {
                        List<Item> items = itemRepository.findBySubtopicIdOrderBySortOrderAsc(subtopic.getId());
                        return SubtopicWithItems.from(subtopic, items);
                    })
                    .collect(Collectors.toList());
            return TabWithData.from(tab, null, subtopicsWithItems);
        } else {
            List<Item> items = itemRepository.findByTabIdAndSubtopicIdIsNullOrderBySortOrderAsc(tabId);
            return TabWithData.from(tab, items, null);
        }
    }
    
    @Cacheable(value = CacheConfig.TAB_DATA_CACHE, key = "'allWithData'")
    public List<TabWithData> getAllTabsWithData() {
        log.debug("Fetching all tabs with data from database");
        List<Tab> tabs = tabRepository.findAllByOrderBySortOrderAsc();
        return tabs.stream()
                .map(tab -> {
                    if (Boolean.TRUE.equals(tab.getHasSubtopics())) {
                        List<Subtopic> subtopics = subtopicRepository.findByTabIdOrderBySortOrderAsc(tab.getId());
                        List<SubtopicWithItems> subtopicsWithItems = subtopics.stream()
                                .map(subtopic -> {
                                    List<Item> items = itemRepository.findBySubtopicIdOrderBySortOrderAsc(subtopic.getId());
                                    return SubtopicWithItems.from(subtopic, items);
                                })
                                .collect(Collectors.toList());
                        return TabWithData.from(tab, null, subtopicsWithItems);
                    } else {
                        List<Item> items = itemRepository.findByTabIdAndSubtopicIdIsNullOrderBySortOrderAsc(tab.getId());
                        return TabWithData.from(tab, items, null);
                    }
                })
                .collect(Collectors.toList());
    }
    
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.TABS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public Tab createTab(Tab tab) {
        log.debug("Creating new tab: {}", tab.getName());
        if (tab.getSortOrder() == null) {
            long count = tabRepository.count();
            tab.setSortOrder((int) count);
        }
        return tabRepository.save(tab);
    }
    
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.TAB_CACHE, key = "#id"),
            @CacheEvict(value = CacheConfig.TABS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public Tab updateTab(String id, Tab tabUpdates) {
        log.debug("Updating tab: {}", id);
        Tab existingTab = tabRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tab not found with id: " + id));
        
        if (tabUpdates.getName() != null) {
            existingTab.setName(tabUpdates.getName());
        }
        if (tabUpdates.getIcon() != null) {
            existingTab.setIcon(tabUpdates.getIcon());
        }
        if (tabUpdates.getColor() != null) {
            existingTab.setColor(tabUpdates.getColor());
        }
        if (tabUpdates.getHasSubtopics() != null) {
            existingTab.setHasSubtopics(tabUpdates.getHasSubtopics());
        }
        if (tabUpdates.getSortOrder() != null) {
            existingTab.setSortOrder(tabUpdates.getSortOrder());
        }
        
        return tabRepository.save(existingTab);
    }
    
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = CacheConfig.TAB_CACHE, key = "#id"),
            @CacheEvict(value = CacheConfig.TABS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.TAB_DATA_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.SUBTOPICS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.ITEMS_CACHE, allEntries = true),
            @CacheEvict(value = CacheConfig.DASHBOARD_CACHE, allEntries = true)
    })
    public void deleteTab(String id) {
        log.debug("Deleting tab: {}", id);
        // Delete all items under this tab
        itemRepository.deleteByTabId(id);
        // Delete all subtopics under this tab
        subtopicRepository.deleteByTabId(id);
        // Delete the tab
        tabRepository.deleteById(id);
    }
    
    public int calculateTabProgress(String tabId) {
        Tab tab = getTabById(tabId);
        
        if (Boolean.TRUE.equals(tab.getHasSubtopics())) {
            List<Subtopic> subtopics = subtopicRepository.findByTabIdOrderBySortOrderAsc(tabId);
            int total = 0;
            int completed = 0;
            for (Subtopic subtopic : subtopics) {
                total += itemRepository.countBySubtopicId(subtopic.getId());
                completed += itemRepository.countBySubtopicIdAndCompletedTrue(subtopic.getId());
            }
            return total > 0 ? (completed * 100 / total) : 0;
        } else {
            long total = itemRepository.countByTabId(tabId);
            long completed = itemRepository.countByTabIdAndCompletedTrue(tabId);
            return total > 0 ? (int) (completed * 100 / total) : 0;
        }
    }
    
    @Cacheable(value = CacheConfig.TABS_CACHE, key = "'withSubtopics'")
    public List<String> getTabIdsWithSubtopics() {
        return tabRepository.findByHasSubtopicsTrue()
                .stream()
                .map(Tab::getId)
                .collect(Collectors.toList());
    }
}
