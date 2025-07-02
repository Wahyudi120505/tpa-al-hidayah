package com.project.anisaalawiyah.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponLogin {
    private String email;
    private String token;
    private String role;
    private ResponseStudent responseStudent;
    
}
