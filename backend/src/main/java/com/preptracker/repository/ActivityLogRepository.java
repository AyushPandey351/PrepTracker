package com.preptracker.repository;

import com.preptracker.model.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    
    List<ActivityLog> findAllByOrderByTimestampDesc();
    
    List<ActivityLog> findByDateOrderByTimestampDesc(LocalDate date);
    
    List<ActivityLog> findByDateBetweenOrderByTimestampDesc(LocalDate startDate, LocalDate endDate);
    
    List<ActivityLog> findByTabIdOrderByTimestampDesc(String tabId);
    
    long countByDate(LocalDate date);
    
    void deleteByItemId(String itemId);
}

