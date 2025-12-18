package com.preptracker.repository;

import com.preptracker.model.Tab;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TabRepository extends MongoRepository<Tab, String> {
    
    List<Tab> findAllByOrderBySortOrderAsc();
    
    List<Tab> findByHasSubtopicsTrue();
    
    boolean existsByName(String name);
}

