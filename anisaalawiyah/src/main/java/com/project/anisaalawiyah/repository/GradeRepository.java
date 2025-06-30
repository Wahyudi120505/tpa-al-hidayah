package com.project.anisaalawiyah.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.anisaalawiyah.model.Grade;
import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long>, JpaSpecificationExecutor<Grade> {
    @Query("SELECT g FROM Grade g WHERE g.student.id = :studentId AND g.semester = :semester")
    List<Grade> findByStudentIdAndSemester(@Param("studentId") Long studentId, @Param("semester") String semester);
    List<Grade> findByStudentId(Long studentId);
}
