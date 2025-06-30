package com.project.anisaalawiyah.dto.request;

import java.time.LocalDate;


import com.project.anisaalawiyah.enums.EStudentStatus;

public record RequestAttendance(
    LocalDate date,                                         
   EStudentStatus status, 
    Long studentId

) {
    
}
