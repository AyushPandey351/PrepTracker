package com.preptracker.repository;

import com.preptracker.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, String> {
    
    List<ActivityLog> findAllByOrderByTimestampDesc();
    
    List<ActivityLog> findByDateOrderByTimestampDesc(LocalDate date);
    
    List<ActivityLog> findByDateBetweenOrderByTimestampDesc(LocalDate startDate, LocalDate endDate);
    
    List<ActivityLog> findByTabIdOrderByTimestampDesc(String tabId);
    
    long countByDate(LocalDate date);
    
    @Modifying
    @Transactional
    void deleteByItemId(String itemId);
}
