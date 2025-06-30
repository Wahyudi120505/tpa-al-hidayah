package com.project.anisaalawiyah.dto.response;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class ResponseStudent{
    private Long id;
    private String name;
    private String gender;
    private LocalDate birthDate;
    private String classLevel;
    private ResponseParent responeParent;
}
