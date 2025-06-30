package com.project.anisaalawiyah.dto.request;

public record RequestGrade(
     String semester,
     Double score,
     String name,
     Long studentId,
   Long subjectId
) {
    
}
