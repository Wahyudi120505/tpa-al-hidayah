package com.project.anisaalawiyah.repository;

import com.project.anisaalawiyah.model.StudentMemorizationStatus;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface StudentMemorizationStatusRepository extends JpaRepository<StudentMemorizationStatus, Long>, JpaSpecificationExecutor<StudentMemorizationStatus> {
        List<StudentMemorizationStatus> findByStudentId(Long studentId);
           Optional<StudentMemorizationStatus> findByStudent_IdAndSurah_Id(Long studentId, Long surahId);
}
