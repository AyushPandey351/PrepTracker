package com.preptracker.service;

import com.preptracker.dto.FullDataExport;
import com.preptracker.dto.TabWithData;
import com.preptracker.model.ActivityLog;
import com.preptracker.model.Application;
import com.preptracker.model.ChecklistItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DataExportService {
    
    private final TabService tabService;
    private final ChecklistService checklistService;
    private final ApplicationService applicationService;
    private final ActivityLogService activityLogService;
    
    public FullDataExport exportAllData() {
        List<TabWithData> tabs = tabService.getAllTabsWithData();
        List<String> tabsWithSubtopics = tabService.getTabIdsWithSubtopics();
        List<ChecklistItem> checklist = checklistService.getAllChecklistItems();
        List<Application> applications = applicationService.getAllApplications();
        List<ActivityLog> activityLog = activityLogService.getAllActivityLogs();
        
        return FullDataExport.builder()
                .tabs(tabs)
                .tabsWithSubtopics(tabsWithSubtopics)
                .checklist(checklist)
                .applications(applications)
                .activityLog(activityLog)
                .build();
    }
}

