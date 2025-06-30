package com.project.anisaalawiyah.dto.request;

import com.project.anisaalawiyah.enums.ESortOrderBy;
import java.time.LocalDate;
import com.project.anisaalawiyah.enums.EStudentStatus;

public record RequestFindAllAttendance(
    Integer page,
    Integer size,
    String query,
    ESortOrderBy sortOrder,
    String sortBy,
    LocalDate startDate,
    LocalDate endDate,
    EStudentStatus status
) {
    
}
