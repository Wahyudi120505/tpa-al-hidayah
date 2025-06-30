package com.project.anisaalawiyah.controller;

import com.project.anisaalawiyah.base.GeneralResponse;
import com.project.anisaalawiyah.base.MessageConstant;
import com.project.anisaalawiyah.dto.request.RequestSubject;
import com.project.anisaalawiyah.dto.response.ResponseSubject;
import com.project.anisaalawiyah.enums.ESortOrderBy;
import com.project.anisaalawiyah.mapper.ResponseSubjectMapper;
import com.project.anisaalawiyah.model.Subject;
import com.project.anisaalawiyah.service.SubjectService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@Slf4j
public class SubjectController {

    private final SubjectService subjectService;
    private final ResponseSubjectMapper responseSubjectMapper;

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "ASC") ESortOrderBy sortOrder,
            @RequestParam(defaultValue = "id") List<String> sortBy
    ) {
        try {
            Page<Subject> result = subjectService.getAll(page, size, query, sortOrder, sortBy);
            Page<ResponseSubject> response = result.map(responseSubjectMapper::convert);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in getAll Subject: ", e);
            return ResponseEntity.internalServerError().body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            Subject subject = subjectService.findById(id);
            return ResponseEntity.ok(responseSubjectMapper.convert(subject));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RequestSubject request) {
        try {
            Subject subject = subjectService.create(request);
            return ResponseEntity.ok(responseSubjectMapper.convert(subject));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RequestSubject request) {
        try {
            Subject subject = subjectService.update(id, request);
            return ResponseEntity.ok(responseSubjectMapper.convert(subject));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            subjectService.delete(id);
            return ResponseEntity.ok("Berhasil menghapus subject dengan ID " + id);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }
}
