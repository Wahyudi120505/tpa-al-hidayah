package com.project.anisaalawiyah.dto.request;

import com.google.auto.value.AutoValue.Builder;


@Builder 
public record RequestGradeDetail(
    Long subjectId,
    Double score
    
) {
 
    
}
