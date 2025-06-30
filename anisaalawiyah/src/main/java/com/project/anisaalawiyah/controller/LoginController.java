package com.project.anisaalawiyah.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RequestBody;

import com.project.anisaalawiyah.base.GeneralResponse;
import com.project.anisaalawiyah.base.MessageConstant;
import com.project.anisaalawiyah.dto.request.RequestLogin;
import com.project.anisaalawiyah.dto.response.ResponLogin;
import com.project.anisaalawiyah.service.LoginService;
import lombok.extern.slf4j.Slf4j;

// @CrossOrigin (origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
@Slf4j 
public class LoginController {
  @Autowired
    LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody RequestLogin loginRequestDto) {
        try{
           ResponLogin loginResponseDto = loginService.login(loginRequestDto);
            return ResponseEntity.ok()
                    .body(GeneralResponse.success(loginResponseDto,
                            MessageConstant.OK_POST_DATA));
        } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode())
                    .body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }

    }
    
    @PostMapping("/verify-token")
    public ResponseEntity<Object> verifyToken(@RequestParam String idToken) {
        try {
            String uid = loginService.verifyToken(idToken);
            return ResponseEntity.ok()
                    .body(GeneralResponse.success(uid, "Token valid"));
        } catch (ResponseStatusException e) {
            log.info(e.getMessage());
            return ResponseEntity.status(e.getStatusCode())
                    .body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            log.info(e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }
  
    @PostMapping("/register-admin")
    public ResponseEntity<Object> registerAdmin(@RequestBody RequestLogin request) {
        try {
            loginService.registerAdmin(request);
            System.out.println("MASUK REGISTER ADMIN");
            return ResponseEntity.ok(GeneralResponse.success(null, "Admin berhasil dibuat"));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(GeneralResponse.error(e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error("Gagal membuat admin"));
        }
    }
}
