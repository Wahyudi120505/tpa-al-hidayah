package com.project.anisaalawiyah.dto.request;


import com.project.anisaalawiyah.enums.ESortOrderBy;

public record RequestFindAllParent(
    Integer page,
    Integer size,
    String query,
    Boolean status,
    ESortOrderBy sortOrder,
     String sortBy
) {}
