package com.project.anisaalawiyah.controller;

import com.project.anisaalawiyah.base.GeneralResponse;
import com.project.anisaalawiyah.base.MessageConstant;
import com.project.anisaalawiyah.dto.request.RequestFindAllStudent;
import com.project.anisaalawiyah.dto.request.RequestStudent;
import com.project.anisaalawiyah.dto.response.ResponseStudent;
import com.project.anisaalawiyah.mapper.ResponseStudentMapper;
import com.project.anisaalawiyah.model.Student;
import com.project.anisaalawiyah.service.StudentService;
import com.project.anisaalawiyah.enums.ESortOrderBy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Slf4j
public class StudentController {

    private final StudentService studentService;
    private final ResponseStudentMapper responseStudentMapper;

@GetMapping
public ResponseEntity<?> getAll(
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "10") Integer size,
        @RequestParam(required = false) String query,
        @RequestParam(required = false) String sortBy,
        @RequestParam(defaultValue = "ASC") ESortOrderBy sortOrder
) {
    try {
        RequestFindAllStudent request = new RequestFindAllStudent(page, size, query, sortOrder, sortBy, null, null);
        Page<Student> result = studentService.getAll(request);
        Page<ResponseStudent> response = result.map(responseStudentMapper::convert);
        return ResponseEntity.ok(response);
    } catch (ResponseStatusException e) {
        log.info(e.getMessage());
        return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
    } catch (Exception e) {
        log.info(e.getMessage());
        return ResponseEntity.internalServerError()
                .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
    }
}


    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            Student student = studentService.findById(id);
            return ResponseEntity.ok(responseStudentMapper.convert(student));
        } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RequestStudent request) {
        try {
            Student student = studentService.create(request);
            return ResponseEntity.ok(responseStudentMapper.convert(student));
      } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RequestStudent request) {
        try {
            Student student = studentService.update(id, request);
         return ResponseEntity.ok(responseStudentMapper.convert(student));
        } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            studentService.delete(id);
            return ResponseEntity.ok("Berhasil menghapus siswa dengan ID " + id);
  } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }
}
