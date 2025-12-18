package com.preptracker.dto;

import com.preptracker.model.Item;
import com.preptracker.model.Subtopic;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubtopicWithItems {
    
    private String id;
    private String name;
    private String color;
    private String tabId;
    private Integer sortOrder;
    private List<Item> items;
    private int progress;
    
    public static SubtopicWithItems from(Subtopic subtopic, List<Item> items) {
        int total = items.size();
        int completed = (int) items.stream().filter(Item::getCompleted).count();
        int progress = total > 0 ? (completed * 100 / total) : 0;
        
        return SubtopicWithItems.builder()
                .id(subtopic.getId())
                .name(subtopic.getName())
                .color(subtopic.getColor())
                .tabId(subtopic.getTabId())
                .sortOrder(subtopic.getSortOrder())
                .items(items)
                .progress(progress)
                .build();
    }
}

