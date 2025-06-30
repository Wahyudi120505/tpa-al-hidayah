package com.project.anisaalawiyah.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.project.anisaalawiyah.model.Subject;

public interface SubjectRepository  extends JpaRepository<Subject,Long>, JpaSpecificationExecutor<Subject> {
    
}
