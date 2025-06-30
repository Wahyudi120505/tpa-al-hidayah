package com.project.anisaalawiyah.service.impl;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.project.anisaalawiyah.enums.EReportFileType;

import lombok.extern.slf4j.Slf4j;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Map;

// @Component
// public class GenerateReportHelper {

//     public byte[] generateReport(String jrxmlPath, Map<String, Object> parameters, EReportFileType fileType, JRDataSource dataSource) {
//         try {
// InputStream inputStream = new ClassPathResource("templates/report-card.jrxml").getInputStream();


//             JasperReport jasperReport = JasperCompileManager.compileReport(inputStream );

//             JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

//             if (fileType == EReportFileType.PDF) {
//                 return JasperExportManager.exportReportToPdf(jasperPrint);
//             } else if (fileType == EReportFileType.EXCEL) {
//                 ByteArrayOutputStream out = new ByteArrayOutputStream();
//                 JRXlsxExporter exporter = new JRXlsxExporter();
//                 exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
//                 exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
//                 exporter.exportReport();
//                 return out.toByteArray();
//             } else {
//                 throw new RuntimeException("Unsupported export type.");
//             }

//         } catch (Exception e) {
//             throw new RuntimeException("Failed to generate report", e);
//         }
//     }
// }
@Component
@Slf4j
public class GenerateReportHelper {

    public byte[] generateReport(String jrxmlPath, Map<String, Object> parameters, EReportFileType fileType, Connection connection) {
        try {
            // Load file .jrxml dari classpath
            InputStream inputStream = new ClassPathResource("templates/report-card.jrxml").getInputStream();
            JasperReport jasperReport = JasperCompileManager.compileReport(inputStream);

            // Isi laporan dengan parameter dan koneksi ke DB
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, connection);

            // ✅ Tambahkan log ini setelah fillReport()
            log.info("Jumlah halaman di JasperPrint: {}", jasperPrint.getPages().size());

            // Export berdasarkan tipe file
            if (fileType == EReportFileType.PDF) {
                return JasperExportManager.exportReportToPdf(jasperPrint);
            } else if (fileType == EReportFileType.EXCEL) {
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                JRXlsxExporter exporter = new JRXlsxExporter();
                exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
                exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
                exporter.exportReport();
                return out.toByteArray();
            } else {
                throw new RuntimeException("Unsupported export type.");
            }

        } catch (Exception e) {
            log.error("Gagal generate report", e);
            throw new RuntimeException("Failed to generate report", e);
        }
    }
}
