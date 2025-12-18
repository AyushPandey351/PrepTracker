package com.preptracker.controller;

import com.preptracker.dto.TabWithData;
import com.preptracker.model.Tab;
import com.preptracker.service.TabService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tabs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TabController {
    
    private final TabService tabService;
    
    @GetMapping
    public ResponseEntity<List<Tab>> getAllTabs() {
        return ResponseEntity.ok(tabService.getAllTabs());
    }
    
    @GetMapping("/with-data")
    public ResponseEntity<List<TabWithData>> getAllTabsWithData() {
        return ResponseEntity.ok(tabService.getAllTabsWithData());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Tab> getTabById(@PathVariable String id) {
        return ResponseEntity.ok(tabService.getTabById(id));
    }
    
    @GetMapping("/{id}/with-data")
    public ResponseEntity<TabWithData> getTabWithData(@PathVariable String id) {
        return ResponseEntity.ok(tabService.getTabWithData(id));
    }
    
    @GetMapping("/{id}/progress")
    public ResponseEntity<Integer> getTabProgress(@PathVariable String id) {
        return ResponseEntity.ok(tabService.calculateTabProgress(id));
    }
    
    @GetMapping("/with-subtopics")
    public ResponseEntity<List<String>> getTabIdsWithSubtopics() {
        return ResponseEntity.ok(tabService.getTabIdsWithSubtopics());
    }
    
    @PostMapping
    public ResponseEntity<Tab> createTab(@Valid @RequestBody Tab tab) {
        Tab createdTab = tabService.createTab(tab);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTab);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Tab> updateTab(@PathVariable String id, @RequestBody Tab tab) {
        return ResponseEntity.ok(tabService.updateTab(id, tab));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTab(@PathVariable String id) {
        tabService.deleteTab(id);
        return ResponseEntity.noContent().build();
    }
}

