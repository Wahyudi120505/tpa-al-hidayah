package com.project.anisaalawiyah.dto.request;

import java.time.LocalDate;

import com.project.anisaalawiyah.enums.EPymentStatus;


public record RequestPyment(
    LocalDate date,                                          
    EPymentStatus status,
    LocalDate paymentDate,
    Long student_id
  
) {
    
}
