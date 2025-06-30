package com.project.anisaalawiyah.controller;


import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.server.ResponseStatusException;

import com.project.anisaalawiyah.base.GeneralResponse;
import com.project.anisaalawiyah.base.MessageConstant;
import com.project.anisaalawiyah.dto.request.RequestFindAllPyment;
import com.project.anisaalawiyah.dto.request.RequestPyment;

import com.project.anisaalawiyah.dto.response.ResponsePyment;
import com.project.anisaalawiyah.model.Pyment;
import com.project.anisaalawiyah.service.PymentService;
import com.project.anisaalawiyah.enums.EPymentStatus;
import com.project.anisaalawiyah.enums.ESortOrderBy;
import com.project.anisaalawiyah.mapper.ResponsePymentMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PymentController {
    
    private final PymentService pymentService;
    private final ResponsePymentMapper responsePymentMapper;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RequestPyment request) {
        try {
            Pyment pyment = pymentService.create(request);
            return ResponseEntity.ok(responsePymentMapper.convert(pyment));
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
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RequestPyment request) {
        try {
            Pyment pyment = pymentService.update(id, request);
            return ResponseEntity.ok(responsePymentMapper.convert(pyment));
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
            pymentService.delete(id);
            return ResponseEntity.ok("Berhasil menghapus pembayaran dengan ID " + id);
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
    public ResponseEntity<?> getPymentById(@PathVariable Long id) {
        try {
            Pyment pyment = pymentService.getById(id);
            return ResponseEntity.ok(responsePymentMapper.convert(pyment));
        } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "ASC") ESortOrderBy sortOrder,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) EPymentStatus status
    ) {
        try {
            RequestFindAllPyment request = new RequestFindAllPyment(page, size, query, sortOrder,query, startDate, endDate, status);
            Page<Pyment> result = pymentService.getAll(request);
            Page<ResponsePyment> response = result.map(responsePymentMapper::convert);
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
}
