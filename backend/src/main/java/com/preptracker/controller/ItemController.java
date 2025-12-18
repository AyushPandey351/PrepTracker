package com.preptracker.controller;

import com.preptracker.model.Item;
import com.preptracker.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ItemController {
    
    private final ItemService itemService;
    
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable String id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }
    
    @GetMapping("/tab/{tabId}")
    public ResponseEntity<List<Item>> getItemsByTabId(@PathVariable String tabId) {
        return ResponseEntity.ok(itemService.getItemsByTabId(tabId));
    }
    
    @GetMapping("/subtopic/{subtopicId}")
    public ResponseEntity<List<Item>> getItemsBySubtopicId(@PathVariable String subtopicId) {
        return ResponseEntity.ok(itemService.getItemsBySubtopicId(subtopicId));
    }
    
    @PostMapping
    public ResponseEntity<Item> createItem(@Valid @RequestBody Item item) {
        Item createdItem = itemService.createItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable String id, @RequestBody Item item) {
        return ResponseEntity.ok(itemService.updateItem(id, item));
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Item> toggleItemCompletion(@PathVariable String id) {
        return ResponseEntity.ok(itemService.toggleItemCompletion(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}

