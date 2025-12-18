package com.preptracker.controller;

import com.preptracker.model.ChecklistItem;
import com.preptracker.service.ChecklistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checklist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChecklistController {
    
    private final ChecklistService checklistService;
    
    @GetMapping
    public ResponseEntity<List<ChecklistItem>> getAllChecklistItems() {
        return ResponseEntity.ok(checklistService.getAllChecklistItems());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ChecklistItem> getChecklistItemById(@PathVariable String id) {
        return ResponseEntity.ok(checklistService.getChecklistItemById(id));
    }
    
    @PostMapping
    public ResponseEntity<ChecklistItem> createChecklistItem(@Valid @RequestBody ChecklistItem item) {
        ChecklistItem createdItem = checklistService.createChecklistItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ChecklistItem> updateChecklistItem(@PathVariable String id, @RequestBody ChecklistItem item) {
        return ResponseEntity.ok(checklistService.updateChecklistItem(id, item));
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ChecklistItem> toggleChecklistItem(@PathVariable String id) {
        return ResponseEntity.ok(checklistService.toggleChecklistItem(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChecklistItem(@PathVariable String id) {
        checklistService.deleteChecklistItem(id);
        return ResponseEntity.noContent().build();
    }
}

