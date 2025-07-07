package com.project.anisaalawiyah.controller;

import com.project.anisaalawiyah.dto.response.ResponseReportDto;
import com.project.anisaalawiyah.enums.EReportFileType;
import com.project.anisaalawiyah.service.ReportService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/report")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/student/{id}/download")
    public ResponseEntity<byte[]> downloadReport(@PathVariable("id") Long studentId) {
        try {
            ResponseReportDto report = reportService.generateStudentReport(studentId, EReportFileType.PDF);
            
            if (report.getFileContent() == null || report.getFileContent().length == 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Gagal generate report".getBytes(StandardCharsets.UTF_8));
            }

            // Set headers untuk download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            
            // Tambahkan header untuk memastikan browser mendownload file
            String encodedFileName = URLEncoder.encode(report.getFileName(), StandardCharsets.UTF_8.toString());
            headers.add("Content-Disposition", "attachment; filename*=UTF-8''" + encodedFileName);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(report.getFileContent());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(("Error: " + e.getMessage()).getBytes(StandardCharsets.UTF_8));
        }
    }

    // Endpoint lama untuk backward compatibility (mengembalikan link)
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
