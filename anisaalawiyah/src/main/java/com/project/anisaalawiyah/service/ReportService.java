package com.project.anisaalawiyah.service;

import java.io.IOException;



import com.project.anisaalawiyah.dto.response.ResponseReportDto;
import com.project.anisaalawiyah.enums.EReportFileType;


public interface ReportService {
 
public ResponseReportDto generateStudentReport(Long studentId, String semester, String academicYear, EReportFileType fileType) throws IOException;
}
