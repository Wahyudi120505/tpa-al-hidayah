package com.project.anisaalawiyah.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResponseAttendanceSummary {
    private Long studentId;
    private String studentName;
    private String month;
    private String year;
    private Integer totalDays;
    private Integer hadirCount;
    private Integer izinCount;
    private Integer alfaCount;
    private Integer sakitCount;
    private Double attendancePercentage;
} 