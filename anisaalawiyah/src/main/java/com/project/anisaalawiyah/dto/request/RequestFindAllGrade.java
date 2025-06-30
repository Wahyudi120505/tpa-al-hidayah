package com.project.anisaalawiyah.dto.request;

import com.project.anisaalawiyah.enums.ESortOrderBy;

public record RequestFindAllGrade(
    Integer page,
    Integer size,
    String query,
    ESortOrderBy sortOrder,
     String sortBy
) {}
