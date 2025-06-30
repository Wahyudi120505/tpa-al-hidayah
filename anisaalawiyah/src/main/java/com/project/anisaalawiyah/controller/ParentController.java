package com.project.anisaalawiyah.controller;

import com.project.anisaalawiyah.base.GeneralResponse;
import com.project.anisaalawiyah.base.MessageConstant;
import com.project.anisaalawiyah.dto.request.RequestFindAllParent;
import com.project.anisaalawiyah.dto.request.RequestParent;
import com.project.anisaalawiyah.dto.response.ResponseParent;
import com.project.anisaalawiyah.mapper.ResponseParentMapper;
import com.project.anisaalawiyah.model.Parent;
import com.project.anisaalawiyah.service.ParentService;
import com.project.anisaalawiyah.enums.ESortOrderBy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
@Slf4j
public class ParentController {

    private final ParentService parentService;
    private final ResponseParentMapper responseParentMapper;

@GetMapping
public ResponseEntity<?> getAll(
        @RequestParam(defaultValue = "1") Integer page,
        @RequestParam(defaultValue = "10") Integer size,
        @RequestParam(required = false) String query,
        @RequestParam(required = false) String sortBy,
        @RequestParam(defaultValue = "ASC") ESortOrderBy sortOrder){
    try {
        RequestFindAllParent request = new RequestFindAllParent(page, size, query, sortOrder, sortBy);
        Page<Parent> result = parentService.getAll(request);
        Page<ResponseParent> response = result.map(responseParentMapper::convert);
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
            Parent parent = parentService.findById(id);
            return ResponseEntity.ok(responseParentMapper.convert(parent));
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
    public ResponseEntity<?> create(@RequestBody RequestParent request) {
        try {
            Parent parent = parentService.create(request);
            return ResponseEntity.ok(responseParentMapper.convert(parent));
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
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RequestParent request) {
        try {
            Parent parent = parentService.update(id, request);
            return ResponseEntity.ok(responseParentMapper.convert(parent));
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
            parentService.delete(id);
            return ResponseEntity.ok("Berhasil menghapus orang tua dengan ID " + id);
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
