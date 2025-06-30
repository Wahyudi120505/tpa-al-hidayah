package com.project.anisaalawiyah.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponLogin {
    private String email;
    private String token;
    private String role;
    
}
