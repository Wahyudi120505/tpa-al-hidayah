package com.project.anisaalawiyah.dto.request;

import java.time.LocalDate;

import com.project.anisaalawiyah.enums.ESortOrderBy;

public record RequestFindAllStudent(
    Integer page,
    Integer size,
    String query,
    ESortOrderBy sortOrder,
    String sortBy,
    LocalDate startBirthDate,
    LocalDate endBirthDate
    // Integer rowStatus
) {}

 
