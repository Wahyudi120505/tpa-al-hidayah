package com.project.anisaalawiyah.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ResponseSurah{
    private Long id;
     private   String name;
     private   Integer number;
}