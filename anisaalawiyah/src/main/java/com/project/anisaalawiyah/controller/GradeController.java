package com.project.anisaalawiyah.controller;





import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.anisaalawiyah.dto.request.RequestFindAllGrade;
import com.project.anisaalawiyah.dto.request.RequestGrade;
import com.project.anisaalawiyah.dto.response.StudentWithGradesDto;
import com.project.anisaalawiyah.model.Grade;
import com.project.anisaalawiyah.repository.GradeRepository;
import com.project.anisaalawiyah.service.GradeService;
import com.project.anisaalawiyah.enums.ESortOrderBy;
import com.project.anisaalawiyah.mapper.ResponseGradeMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {
    private final GradeService gradeService;
    private final ResponseGradeMapper responseGradeMapper;
    private final GradeRepository gradeRepository;
@GetMapping
public ResponseEntity<?> getAll(
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "10") Integer size,
        @RequestParam(required = false) String query,
        @RequestParam(required = false) String semester, // filter semester
        @RequestParam(defaultValue = "DESC") ESortOrderBy sortOrder
) {
    try {
        // Buat request DTO
        RequestFindAllGrade request = new RequestFindAllGrade(
            page,
            size,
            query,
            semester,
            sortOrder,
            null // sortBy, bisa null atau "id" default
        );

        Page<Grade> result = gradeService.getAll(request);
    Page<StudentWithGradesDto> response = result.map(responseGradeMapper::convert);
        return ResponseEntity.ok(response );
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body("Gagal mengambil daftar nilai: " + e.getMessage());
    }
}

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            Grade grade = gradeService.findById(id);
            return ResponseEntity.ok(responseGradeMapper.convert(grade));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Nilai dengan ID " + id + " tidak ditemukan: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RequestGrade request) {
        try {
            Grade grade = gradeService.create(request);
            return ResponseEntity.ok(responseGradeMapper.convert(grade));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Gagal membuat data nilai: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RequestGrade request) {
        try {
            Grade grade = gradeService.update(id, request);
            return ResponseEntity.ok(responseGradeMapper.convert(grade));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Gagal memperbarui nilai dengan ID " + id + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            gradeService.delete(id);
            return ResponseEntity.ok("Berhasil menghapus nilai dengan ID " + id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Gagal menghapus nilai dengan ID " + id + ": " + e.getMessage());
        }
    }
     @GetMapping("/{id}/academic-years")
    public ResponseEntity<List<String>> getAcademicYears(@PathVariable("id") Long studentId) {
        List<String> years = gradeRepository.findDistinctAcademicYearsByStudentId(studentId);
        return ResponseEntity.ok(years);
    }
   
}
