package com.project.anisaalawiyah.dto.request;

import lombok.Data;

@Data
public class RequestFindAll {
    private Integer page = 0;
    private Integer size = 10;
    private String search;
    private String sortBy;
    private String direction = "asc";
} 