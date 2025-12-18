package com.preptracker.repository;

import com.preptracker.model.Subtopic;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubtopicRepository extends MongoRepository<Subtopic, String> {
    
    List<Subtopic> findByTabIdOrderBySortOrderAsc(String tabId);
    
    void deleteByTabId(String tabId);
    
    long countByTabId(String tabId);
}

