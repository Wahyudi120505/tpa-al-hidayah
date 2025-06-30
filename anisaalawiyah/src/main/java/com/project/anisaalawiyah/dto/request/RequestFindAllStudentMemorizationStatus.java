package com.project.anisaalawiyah.dto.request;

import com.project.anisaalawiyah.enums.ESortOrderBy;
import java.time.LocalDate;
import com.project.anisaalawiyah.enums.EMemorizationStatus;

public record RequestFindAllStudentMemorizationStatus(
        Integer page,
        Integer size,
        String query,
        ESortOrderBy sortOrder,
        String sortBy,
        LocalDate startUpdatedAt,
        LocalDate endUpdatedAt,
        EMemorizationStatus status
) {
}