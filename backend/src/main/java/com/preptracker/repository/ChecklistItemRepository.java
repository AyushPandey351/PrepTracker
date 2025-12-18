package com.preptracker.repository;

import com.preptracker.model.ChecklistItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChecklistItemRepository extends MongoRepository<ChecklistItem, String> {
    
    List<ChecklistItem> findAllByOrderBySortOrderAsc();
    
    List<ChecklistItem> findByCompletedTrueOrderBySortOrderAsc();
    
    List<ChecklistItem> findByCompletedFalseOrderBySortOrderAsc();
    
    long countByCompletedTrue();
}

