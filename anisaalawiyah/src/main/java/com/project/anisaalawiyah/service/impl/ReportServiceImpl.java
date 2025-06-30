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

// @Service
// @Slf4j
// @RequiredArgsConstructor
// public class ReportServiceImpl implements ReportService {

//     private final CdnFile cdnFile;
//     private final GenerateReportHelper generateReportHelper;
//     private final StudentRepository studentRepository;

//     private static final String XML_REPORTS_PATH = "reports/";
//     private static final String REPORTS_STUDENT_PATH = "student/";
//     private static final String REPORT_CARD_FILE_NAME = "report_card";
//     private static final String REPORT_CARD_XML = "report_card.jrxml";

//     @Override
//     public ResponseReportDto generateStudentReport(Long studentId, EReportFileType fileType) throws IOException {
//         try {
//             String key = getReportKey(REPORTS_STUDENT_PATH + REPORT_CARD_FILE_NAME, studentId, fileType);

//             if (cdnFile.fileIsExist(key)) {
//                 return ResponseReportDto.builder().link(cdnFile.getUrl(key)).build();
//             }

//             Student student = studentRepository.findById(studentId)
//                     .orElseThrow(() -> new RuntimeException("Student not found"));

//             Map<String, Object> params = new HashMap<>();
//             params.put("student_id", studentId);
//             params.put("student_name", student.getName());
//             params.put("class_level", student.getClassLevel());

//             JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(student.getGrades());

//             byte[] reportBytes = generateReportHelper.generateReport(
//                     XML_REPORTS_PATH + REPORT_CARD_XML,
//                     params,
//                     fileType,
//                     dataSource
//             );

//             cdnFile.putFile(reportBytes, key);
//             return ResponseReportDto.builder().link(cdnFile.getUrl(key)).build();

//         } catch (Exception e) {
//             log.error("Error generate report card: {}", e.getMessage(), e);
//             return ResponseReportDto.builder().link(null).build();
//         }
//     }

//     private String getReportKey(String filePath, Long studentId, EReportFileType fileType) {
//         return filePath + "-" + studentId + fileType.getExt();
//     }
// }
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@Slf4j
@RequiredArgsConstructor
@SuppressWarnings("deprecation")
public class ReportServiceImpl implements ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportServiceImpl.class);
    private final CdnFile cdnFile;
    private final GenerateReportHelper generateReportHelper;
    private final StudentRepository studentRepository;
    private final DataSource dataSource; // Tambahkan ini!

    private static final String XML_REPORTS_PATH = "reports/";
    private static final String REPORTS_STUDENT_PATH = "student/";
    private static final String REPORT_CARD_FILE_NAME = "report_card";
    private static final String REPORT_CARD_XML = "report_card.jrxml";

@Override
public ResponseReportDto generateStudentReport(Long studentId, EReportFileType fileType) throws IOException {
    try {
        String key = getReportKey(REPORTS_STUDENT_PATH + REPORT_CARD_FILE_NAME, studentId, fileType);

        // 🧹 Jika file lama sudah ada, hapus dulu
        if (cdnFile.fileIsExist(key)) {
            log.info("File lama ditemukan, menghapus: {}", key);
            cdnFile.deleteFile(key);
        }

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

            cdnFile.putFile(reportBytes, key);
            return ResponseReportDto.builder().link(cdnFile.getUrl(key)).build();
        }

    } catch (Exception e) {
        log.error("Error generate report card: {}", e.getMessage(), e);
        return ResponseReportDto.builder().link(null).build();
    }
}


    private String getReportKey(String filePath, Long studentId, EReportFileType fileType) {
        return filePath + "-" + studentId + fileType.getExt();
    }
}



