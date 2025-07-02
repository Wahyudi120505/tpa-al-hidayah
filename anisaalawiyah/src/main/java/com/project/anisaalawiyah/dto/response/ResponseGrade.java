package com.project.anisaalawiyah.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ResponseGrade{
    private Long id;
    private Double score;
    private String semester;
    private String academicYear;
    private ResponseStudent responseStudent;

    private ResponseSubject responseSubject;

   }
