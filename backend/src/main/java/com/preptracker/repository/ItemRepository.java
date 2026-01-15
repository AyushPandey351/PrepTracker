package com.preptracker.repository;

import com.preptracker.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, String> {
    
    List<Item> findByTabIdOrderBySortOrderAsc(String tabId);
    
    List<Item> findByTabIdAndSubtopicIdIsNullOrderBySortOrderAsc(String tabId);
    
    List<Item> findBySubtopicIdOrderBySortOrderAsc(String subtopicId);
    
    List<Item> findByTabIdAndCompletedTrue(String tabId);
    
    List<Item> findBySubtopicIdAndCompletedTrue(String subtopicId);
    
    long countByTabId(String tabId);
    
    long countByTabIdAndCompletedTrue(String tabId);
    
    long countBySubtopicId(String subtopicId);
    
    long countBySubtopicIdAndCompletedTrue(String subtopicId);
    
    @Modifying
    @Transactional
    void deleteByTabId(String tabId);
    
    @Modifying
    @Transactional
    void deleteBySubtopicId(String subtopicId);
    
    long countByCompletedTrue();
}
