package com.preptracker.repository;

import com.preptracker.model.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, String> {
    
    List<ChecklistItem> findAllByOrderBySortOrderAsc();
    
    List<ChecklistItem> findByCompletedTrueOrderBySortOrderAsc();
    
    List<ChecklistItem> findByCompletedFalseOrderBySortOrderAsc();
    
    long countByCompletedTrue();
}
