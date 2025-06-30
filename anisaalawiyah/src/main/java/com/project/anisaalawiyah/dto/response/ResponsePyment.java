package com.project.anisaalawiyah.dto.response;

import java.time.LocalDate;

import com.project.anisaalawiyah.enums.EPymentStatus;

import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class ResponsePyment {
    private Long id;
    private LocalDate date;                                        
    private EPymentStatus status;
    private LocalDate paymentDate;
    private ResponseStudent responseStudent;
}
