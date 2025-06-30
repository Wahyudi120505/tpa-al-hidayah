package com.project.anisaalawiyah.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.project.anisaalawiyah.model.Parent;
public interface ParentRepository extends JpaRepository<Parent,Long>,JpaSpecificationExecutor<Parent>{
    
}
