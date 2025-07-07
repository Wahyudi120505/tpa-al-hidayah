package com.project.anisaalawiyah.controller;

import com.project.anisaalawiyah.base.GeneralResponse;
import com.project.anisaalawiyah.base.MessageConstant;
import com.project.anisaalawiyah.dto.response.ResponseAttendanceSummary;
import com.project.anisaalawiyah.service.AttendanceSummaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;

@RestController
@RequestMapping("/api/attendance-summary")
@RequiredArgsConstructor
@Slf4j
public class AttendanceSummaryController {

    private final AttendanceSummaryService attendanceSummaryService;

    /**
     * Mendapatkan rekap absensi bulanan untuk seorang siswa
     */
    @GetMapping("/student/{studentId}/monthly")
    public ResponseEntity<?> getMonthlyAttendanceSummary(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getMonthValue()}") int month,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int year) {
        try {
            ResponseAttendanceSummary summary = attendanceSummaryService.getMonthlyAttendanceSummary(studentId, month, year);
            return ResponseEntity.ok(summary);
        } catch (ResponseStatusException e) {
            log.error("Error getting monthly attendance summary: {}", e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.error("Error getting monthly attendance summary: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Mendapatkan rekap absensi untuk bulan saat ini
     */
    @GetMapping("/student/{studentId}/current-month")
    public ResponseEntity<?> getCurrentMonthAttendanceSummary(@PathVariable Long studentId) {
        try {
            ResponseAttendanceSummary summary = attendanceSummaryService.getCurrentMonthAttendanceSummary(studentId);
            return ResponseEntity.ok(summary);
        } catch (ResponseStatusException e) {
            log.error("Error getting current month attendance summary: {}", e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.error("Error getting current month attendance summary: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Mendapatkan rekap absensi untuk beberapa bulan terakhir
     */
    @GetMapping("/student/{studentId}/last-months")
    public ResponseEntity<?> getLastMonthsAttendanceSummary(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "3") int monthsBack) {
        try {
            if (monthsBack < 1 || monthsBack > 12) {
                return ResponseEntity.badRequest()
                        .body(GeneralResponse.error("Months back must be between 1 and 12"));
            }
            
            List<ResponseAttendanceSummary> summaries = attendanceSummaryService.getLastMonthsAttendanceSummary(studentId, monthsBack);
            return ResponseEntity.ok(summaries);
        } catch (ResponseStatusException e) {
            log.error("Error getting last months attendance summary: {}", e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.error("Error getting last months attendance summary: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }
} 