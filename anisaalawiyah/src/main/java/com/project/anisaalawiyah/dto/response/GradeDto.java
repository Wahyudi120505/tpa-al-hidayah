package com.project.anisaalawiyah.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GradeDto {
    private Long id;
    private ResponseSubject responseSubject;
    private Double score;
}
