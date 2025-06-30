package com.project.anisaalawiyah.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.project.anisaalawiyah.model.Pyment;

public interface PymentRepository extends JpaRepository<Pyment, Long>, JpaSpecificationExecutor<Pyment> {
}
