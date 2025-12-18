package com.preptracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    
    private int overallProgress;
    private long totalQuestions;
    private long completedQuestions;
    private int totalCategories;
    private List<CategoryProgress> categoryProgress;
    private Map<String, Long> applicationStats;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryProgress {
        private String tabId;
        private String name;
        private String color;
        private int progress;
        private long total;
        private long completed;
    }
}

