package com.project.anisaalawiyah.dto.request;

public record RequestGrade(
     String semester,
     Double score,
     String academicYear,
     Long studentId,
   Long subjectId
) {
    
}
