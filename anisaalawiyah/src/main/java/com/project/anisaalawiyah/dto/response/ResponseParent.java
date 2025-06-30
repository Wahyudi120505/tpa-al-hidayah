package com.project.anisaalawiyah.dto.response;

import lombok.Builder;
import lombok.Data;


@Data
@Builder

public class ResponseParent{
    private Long id;
    private String name;
    private String email;
    private String noHp;
   
} 