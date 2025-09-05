package com.project.anisaalawiyah.dto.request;

import java.util.List;



public record RequestGrade(
    Long studentId,
    String semester,
    String academicYear,
    List<RequestGradeDetail> grades
) {
    
}
