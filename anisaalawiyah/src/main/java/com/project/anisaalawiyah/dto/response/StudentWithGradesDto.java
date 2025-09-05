package com.project.anisaalawiyah.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor
@NoArgsConstructor
public class StudentWithGradesDto {
    private Long id;
    private String studentName;
    private String academicYear;
    private String semester;
    private List<GradeDto> grades;
}