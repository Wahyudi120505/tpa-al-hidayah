package com.project.anisaalawiyah.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResponseReportDto {
    private String link;      
    private String fileName;  
    private Long fileSize;
    private byte[] fileContent;    
}
