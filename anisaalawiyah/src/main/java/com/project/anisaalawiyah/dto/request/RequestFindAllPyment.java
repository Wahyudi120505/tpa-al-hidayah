package com.project.anisaalawiyah.dto.request;

import java.time.LocalDate;

import com.project.anisaalawiyah.enums.ESortOrderBy;
import com.project.anisaalawiyah.enums.EPymentStatus;

public record RequestFindAllPyment(
    Integer page,
    Integer size,
    String query,
    ESortOrderBy sortOrder,
    String sortBy,
    LocalDate startDate,
    LocalDate endDate,
    EPymentStatus status
) {}

   

