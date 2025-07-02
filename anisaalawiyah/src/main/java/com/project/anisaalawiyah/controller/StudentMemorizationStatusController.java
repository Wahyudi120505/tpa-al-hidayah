package com.project.anisaalawiyah.controller;

import com.project.anisaalawiyah.base.GeneralResponse;
import com.project.anisaalawiyah.base.MessageConstant;
import com.project.anisaalawiyah.dto.request.RequestFindAllStudentMemorizationStatus;
import com.project.anisaalawiyah.dto.request.RequestStudentMemorizationStatus;
import com.project.anisaalawiyah.dto.response.ResponseStudentMemorizationStatus;
import com.project.anisaalawiyah.enums.ESortOrderBy;
import com.project.anisaalawiyah.mapper.ResponseStudentMemorizationStatusMapper;
import com.project.anisaalawiyah.model.StudentMemorizationStatus;
import com.project.anisaalawiyah.service.StudentMemorizationStatusService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;


@RestController
@RequestMapping("/api/student-memorization-status")
@RequiredArgsConstructor
@Slf4j
public class StudentMemorizationStatusController {

    private final StudentMemorizationStatusService studentMemorizationStatusService;

   private final ResponseStudentMemorizationStatusMapper responseStudentMemorizationStatusMapper;


    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "ASC") ESortOrderBy sortOrder,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startUpdatedAt,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endUpdatedAt
    ) {
        try {
            RequestFindAllStudentMemorizationStatus request = new RequestFindAllStudentMemorizationStatus(
                    page, size, query, sortOrder,  sortBy, startUpdatedAt, endUpdatedAt, null
            );

            Page<StudentMemorizationStatus> result = studentMemorizationStatusService.getAll(request);
            Page<ResponseStudentMemorizationStatus> response = result.map(responseStudentMemorizationStatusMapper::convert);
            return ResponseEntity.ok(response);

        } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.error("Error in getAll StudentMemorizationStatus: ", e);
            return ResponseEntity.internalServerError().body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            StudentMemorizationStatus status = studentMemorizationStatusService.findById(id);
            return ResponseEntity.ok(responseStudentMemorizationStatusMapper.convert(status));
        } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.error("Error in findById StudentMemorizationStatus: ", e);
            return ResponseEntity.internalServerError().body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RequestStudentMemorizationStatus request) {
        try {
            StudentMemorizationStatus status = studentMemorizationStatusService.create(request);
            return ResponseEntity.ok(responseStudentMemorizationStatusMapper.convert(status));
        } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.error("Error in create StudentMemorizationStatus: ", e);
            return ResponseEntity.internalServerError().body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RequestStudentMemorizationStatus request) {
        try {
            StudentMemorizationStatus status = studentMemorizationStatusService.update(id, request);
            return ResponseEntity.ok(responseStudentMemorizationStatusMapper.convert(status));
        } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.error("Error in update StudentMemorizationStatus: ", e);
            return ResponseEntity.internalServerError().body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            studentMemorizationStatusService.delete(id);
            return ResponseEntity.ok("Berhasil menghapus status hafalan dengan ID " + id);
        } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.error("Error in delete StudentMemorizationStatus: ", e);
            return ResponseEntity.internalServerError().body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }
}
