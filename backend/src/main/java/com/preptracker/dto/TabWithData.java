package com.preptracker.dto;

import com.preptracker.model.Item;
import com.preptracker.model.Tab;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TabWithData {
    
    private String id;
    private String name;
    private String icon;
    private String color;
    private Boolean hasSubtopics;
    private Integer sortOrder;
    
    // For tabs without subtopics
    private List<Item> items;
    
    // For tabs with subtopics
    private List<SubtopicWithItems> subtopics;
    
    private int progress;
    
    public static TabWithData from(Tab tab, List<Item> items, List<SubtopicWithItems> subtopics) {
        int progress = 0;
        
        if (Boolean.TRUE.equals(tab.getHasSubtopics()) && subtopics != null) {
            int total = subtopics.stream()
                    .mapToInt(s -> s.getItems().size())
                    .sum();
            int completed = subtopics.stream()
                    .mapToInt(s -> (int) s.getItems().stream().filter(Item::getCompleted).count())
                    .sum();
            progress = total > 0 ? (completed * 100 / total) : 0;
        } else if (items != null) {
            int total = items.size();
            int completed = (int) items.stream().filter(Item::getCompleted).count();
            progress = total > 0 ? (completed * 100 / total) : 0;
        }
        
        return TabWithData.builder()
                .id(tab.getId())
                .name(tab.getName())
                .icon(tab.getIcon())
                .color(tab.getColor())
                .hasSubtopics(tab.getHasSubtopics())
                .sortOrder(tab.getSortOrder())
                .items(items)
                .subtopics(subtopics)
                .progress(progress)
                .build();
    }
}

