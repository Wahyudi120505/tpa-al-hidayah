package com.project.anisaalawiyah.dto.request;



import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RequestSurah {
    private String name;
    private Integer number;
}
