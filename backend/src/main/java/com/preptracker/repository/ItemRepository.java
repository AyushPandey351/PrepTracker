package com.preptracker.repository;

import com.preptracker.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    
    List<Item> findByTabIdOrderBySortOrderAsc(String tabId);
    
    List<Item> findByTabIdAndSubtopicIdIsNullOrderBySortOrderAsc(String tabId);
    
    List<Item> findBySubtopicIdOrderBySortOrderAsc(String subtopicId);
    
    List<Item> findByTabIdAndCompletedTrue(String tabId);
    
    List<Item> findBySubtopicIdAndCompletedTrue(String subtopicId);
    
    long countByTabId(String tabId);
    
    long countByTabIdAndCompletedTrue(String tabId);
    
    long countBySubtopicId(String subtopicId);
    
    long countBySubtopicIdAndCompletedTrue(String subtopicId);
    
    void deleteByTabId(String tabId);
    
    void deleteBySubtopicId(String subtopicId);
    
    long countByCompletedTrue();
}

