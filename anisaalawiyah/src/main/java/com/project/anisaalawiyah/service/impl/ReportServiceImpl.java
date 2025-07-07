package com.project.anisaalawiyah.service.impl;

import com.project.anisaalawiyah.dto.response.ResponseReportDto;
import com.project.anisaalawiyah.enums.EReportFileType;
import com.project.anisaalawiyah.model.Student;
import com.project.anisaalawiyah.repository.StudentRepository;
import com.project.anisaalawiyah.service.CdnFile;
import com.project.anisaalawiyah.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.project.anisaalawiyah.model.Grade;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportServiceImpl.class);
    private final CdnFile cdnFile;
    private final GenerateReportHelper generateReportHelper;
    private final StudentRepository studentRepository;
    private final DataSource dataSource;

    private static final String XML_REPORTS_PATH = "reports/";
    private static final String REPORTS_STUDENT_PATH = "student/";
    private static final String REPORT_CARD_FILE_NAME = "report_card";
    private static final String REPORT_CARD_XML = "report_card.jrxml";

    @Override
    public ResponseReportDto generateStudentReport(Long studentId, EReportFileType fileType) throws IOException {
        try {
            // Validasi dan ambil data student
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            Map<String, Object> params = new HashMap<>();
            params.put("student_id", studentId);
            params.put("print_date", LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy", new Locale("id", "ID")))); 
            params.put("logo1", "classpath:static/logo.png");
            params.put("logo2", "classpath:static/logo2.png"); 
            
            log.info("Generate report for student_id: {}", studentId);
            log.info("Params: {}", params);

            try (Connection connection = dataSource.getConnection()) {
                byte[] reportBytes = generateReportHelper.generateReport(
                        XML_REPORTS_PATH + REPORT_CARD_XML,
                        params,
                        fileType,
                        connection
                );

                // Generate nama file yang jelas
                String fileName = generateFileName(student, fileType);
                
                return ResponseReportDto.builder()
                        .fileName(fileName)
                        .fileSize((long) reportBytes.length)
                        .fileContent(reportBytes)
                        .build();
            }

        } catch (Exception e) {
            log.error("Error generate report card: {}", e.getMessage(), e);
            return ResponseReportDto.builder()
                    .fileName(null)
                    .fileSize(0L)
                    .fileContent(new byte[0])
                    .build();
        }
    }

    private String generateFileName(Student student, EReportFileType fileType) {
        String studentName = student.getName().replaceAll("[^a-zA-Z0-9\\s]", "").replaceAll("\\s+", "_");
        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        
        // Ambil semester dan tahun ajaran dari grade pertama siswa (jika ada)
        String semester = "Semester_1";
        String academicYear = "2024-2025";
        
        if (student.getGrades() != null && !student.getGrades().isEmpty()) {
            Grade firstGrade = student.getGrades().get(0);
            if (firstGrade.getSemester() != null && !firstGrade.getSemester().trim().isEmpty()) {
                semester = firstGrade.getSemester().replaceAll("[^a-zA-Z0-9\\s]", "").replaceAll("\\s+", "_");
            }
            if (firstGrade.getAcademicYear() != null && !firstGrade.getAcademicYear().trim().isEmpty()) {
                academicYear = firstGrade.getAcademicYear().replaceAll("[^a-zA-Z0-9\\s]", "").replaceAll("\\s+", "_");
            }
        }
        
        return String.format("Rapor_%s_%s_%s_%s%s", 
                studentName, 
                semester, 
                academicYear, 
                currentDate, 
                fileType.getExt());
    }

    private String getReportKey(String filePath, Long studentId, EReportFileType fileType) {
        return filePath + "-" + studentId + fileType.getExt();
    }
}



