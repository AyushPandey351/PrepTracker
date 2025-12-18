package com.preptracker.service;

import com.preptracker.config.CacheConfig;
import com.preptracker.dto.DashboardStats;
import com.preptracker.dto.DashboardStats.CategoryProgress;
import com.preptracker.model.Application.ApplicationStatus;
import com.preptracker.model.Subtopic;
import com.preptracker.model.Tab;
import com.preptracker.repository.ApplicationRepository;
import com.preptracker.repository.ItemRepository;
import com.preptracker.repository.SubtopicRepository;
import com.preptracker.repository.TabRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final TabRepository tabRepository;
    private final SubtopicRepository subtopicRepository;
    private final ItemRepository itemRepository;
    private final ApplicationRepository applicationRepository;
    
    @Cacheable(value = CacheConfig.DASHBOARD_CACHE, key = "'stats'")
    public DashboardStats getDashboardStats() {
        log.debug("Computing dashboard stats");
        List<Tab> tabs = tabRepository.findAllByOrderBySortOrderAsc();
        List<CategoryProgress> categoryProgressList = new ArrayList<>();
        
        long totalQuestions = 0;
        long completedQuestions = 0;
        
        for (Tab tab : tabs) {
            long tabTotal = 0;
            long tabCompleted = 0;
            
            if (Boolean.TRUE.equals(tab.getHasSubtopics())) {
                List<Subtopic> subtopics = subtopicRepository.findByTabIdOrderBySortOrderAsc(tab.getId());
                for (Subtopic subtopic : subtopics) {
                    tabTotal += itemRepository.countBySubtopicId(subtopic.getId());
                    tabCompleted += itemRepository.countBySubtopicIdAndCompletedTrue(subtopic.getId());
                }
            } else {
                tabTotal = itemRepository.countByTabId(tab.getId());
                tabCompleted = itemRepository.countByTabIdAndCompletedTrue(tab.getId());
            }
            
            int progress = tabTotal > 0 ? (int) (tabCompleted * 100 / tabTotal) : 0;
            
            categoryProgressList.add(CategoryProgress.builder()
                    .tabId(tab.getId())
                    .name(tab.getName())
                    .color(tab.getColor())
                    .progress(progress)
                    .total(tabTotal)
                    .completed(tabCompleted)
                    .build());
            
            totalQuestions += tabTotal;
            completedQuestions += tabCompleted;
        }
        
        int overallProgress = totalQuestions > 0 ? (int) (completedQuestions * 100 / totalQuestions) : 0;
        
        // Application stats
        Map<String, Long> applicationStats = new HashMap<>();
        applicationStats.put("applied", applicationRepository.countByStatus(ApplicationStatus.APPLIED));
        applicationStats.put("interview", applicationRepository.countByStatus(ApplicationStatus.INTERVIEW));
        applicationStats.put("offered", applicationRepository.countByStatus(ApplicationStatus.OFFERED));
        applicationStats.put("rejected", applicationRepository.countByStatus(ApplicationStatus.REJECTED));
        applicationStats.put("total", applicationRepository.count());
        
        return DashboardStats.builder()
                .overallProgress(overallProgress)
                .totalQuestions(totalQuestions)
                .completedQuestions(completedQuestions)
                .totalCategories(tabs.size())
                .categoryProgress(categoryProgressList)
                .applicationStats(applicationStats)
                .build();
    }
}
