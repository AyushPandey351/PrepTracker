package com.preptracker.repository;

import com.preptracker.model.Application;
import com.preptracker.model.Application.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {
    
    List<Application> findAllByOrderByDateDesc();
    
    List<Application> findByStatusOrderByDateDesc(ApplicationStatus status);
    
    long countByStatus(ApplicationStatus status);
    
    List<Application> findByCompanyContainingIgnoreCaseOrderByDateDesc(String company);
}
