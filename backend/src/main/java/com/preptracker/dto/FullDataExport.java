package com.preptracker.dto;

import com.preptracker.model.ActivityLog;
import com.preptracker.model.Application;
import com.preptracker.model.ChecklistItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FullDataExport {
    
    private List<TabWithData> tabs;
    private List<String> tabsWithSubtopics;
    private List<ChecklistItem> checklist;
    private List<Application> applications;
    private List<ActivityLog> activityLog;
}

