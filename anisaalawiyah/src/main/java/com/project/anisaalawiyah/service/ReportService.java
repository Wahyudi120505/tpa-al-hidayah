package com.project.anisaalawiyah.service;

import java.io.IOException;



import com.project.anisaalawiyah.dto.response.ResponseReportDto;
import com.project.anisaalawiyah.enums.EReportFileType;


public interface ReportService {
 
ResponseReportDto generateStudentReport(Long studentId, EReportFileType fileType) throws IOException;
}
