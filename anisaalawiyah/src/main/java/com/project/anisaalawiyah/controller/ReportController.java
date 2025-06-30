package com.project.anisaalawiyah.controller;

import com.project.anisaalawiyah.dto.response.ResponseReportDto;
import com.project.anisaalawiyah.enums.EReportFileType;
import com.project.anisaalawiyah.service.ReportService;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/report")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<ResponseReportDto> generateReport(@PathVariable("id") Long studentId) {
        try {
            ResponseReportDto report = reportService.generateStudentReport(studentId, EReportFileType.PDF);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ResponseReportDto.builder().link(null).build());
        }
    }

    
}
