package com.project.anisaalawiyah.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponLogin {
    private Long idAppUser;
    private String email;
    private String token;
    private String role;
    private Long parentId;
    
}
