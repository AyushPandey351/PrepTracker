package com.preptracker.controller;

import com.preptracker.dto.ReorderRequest;
import com.preptracker.dto.SubtopicWithItems;
import com.preptracker.model.Subtopic;
import com.preptracker.service.SubtopicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subtopics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubtopicController {
    
    private final SubtopicService subtopicService;
    
    @GetMapping("/tab/{tabId}")
    public ResponseEntity<List<Subtopic>> getSubtopicsByTabId(@PathVariable String tabId) {
        return ResponseEntity.ok(subtopicService.getSubtopicsByTabId(tabId));
    }
    
    @GetMapping("/tab/{tabId}/with-items")
    public ResponseEntity<List<SubtopicWithItems>> getSubtopicsWithItemsByTabId(@PathVariable String tabId) {
        return ResponseEntity.ok(subtopicService.getSubtopicsWithItemsByTabId(tabId));
    }
    
    // Reorder must come BEFORE /{id} to avoid path variable matching "reorder"
    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderSubtopics(@RequestBody List<ReorderRequest> updates) {
        subtopicService.reorderSubtopics(updates);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Subtopic> getSubtopicById(@PathVariable String id) {
        return ResponseEntity.ok(subtopicService.getSubtopicById(id));
    }
    
    @GetMapping("/{id}/with-items")
    public ResponseEntity<SubtopicWithItems> getSubtopicWithItems(@PathVariable String id) {
        return ResponseEntity.ok(subtopicService.getSubtopicWithItems(id));
    }
    
    @GetMapping("/{id}/progress")
    public ResponseEntity<Integer> getSubtopicProgress(@PathVariable String id) {
        return ResponseEntity.ok(subtopicService.calculateSubtopicProgress(id));
    }
    
    @PostMapping
    public ResponseEntity<Subtopic> createSubtopic(@Valid @RequestBody Subtopic subtopic) {
        Subtopic createdSubtopic = subtopicService.createSubtopic(subtopic);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSubtopic);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Subtopic> updateSubtopic(@PathVariable String id, @RequestBody Subtopic subtopic) {
        return ResponseEntity.ok(subtopicService.updateSubtopic(id, subtopic));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubtopic(@PathVariable String id) {
        subtopicService.deleteSubtopic(id);
        return ResponseEntity.noContent().build();
    }
}
