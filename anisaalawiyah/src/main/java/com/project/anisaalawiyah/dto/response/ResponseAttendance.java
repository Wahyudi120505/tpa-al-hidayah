package com.project.anisaalawiyah.dto.response;

import java.time.LocalDate;
import com.project.anisaalawiyah.enums.EStudentStatus;

import lombok.Builder;
import lombok.Data;
@Builder
@Data
public class ResponseAttendance{
    private Long id;
    private LocalDate date;
    EStudentStatus status;
    private ResponseStudent responseStudent;
} 