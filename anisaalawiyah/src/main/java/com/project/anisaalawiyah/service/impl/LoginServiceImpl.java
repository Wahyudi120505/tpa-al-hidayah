package com.project.anisaalawiyah.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.anisaalawiyah.dto.request.RequestLogin;
import com.project.anisaalawiyah.dto.response.ResponLogin;
import com.project.anisaalawiyah.enums.ERole;
import com.project.anisaalawiyah.model.User;
import com.project.anisaalawiyah.repository.UserRepository;
import com.project.anisaalawiyah.service.LoginService;
import com.project.anisaalawiyah.util.JwtUtil;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

@Service
public class LoginServiceImpl implements LoginService {

   

    @Autowired
    UserRepository registerRepository;

  
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtil jwtUtil;


  

    @Override
    public ResponLogin  login(RequestLogin loginRequestDto) {
      
        System.out.println("Attempting to login with email: " + loginRequestDto.getEmail());
        
        try {
            User user = registerRepository
                    .findByEmail(loginRequestDto.getEmail())
                    .orElse(null);

            if (user == null) {
                System.out.println("User not found for email: " + loginRequestDto.getEmail());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Invalid username or password");
            }

            boolean isMatch = passwordEncoder.matches(loginRequestDto.getPassword(),
                    user.getPassword());

            if (!isMatch) {
                System.out.println("Password does not match for email: " + loginRequestDto.getEmail());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid username or password");
            }

            ResponLogin loginResponseDto = new ResponLogin();
            loginResponseDto.setEmail(user.getEmail());
            loginResponseDto.setToken(jwtUtil.generateToken(user));
            loginResponseDto.setRole(user.getRole().name()); 
            return loginResponseDto;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    public String verifyToken(String idToken) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            return decodedToken.getUid();
        } catch (FirebaseAuthException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token tidak valid");
        }
    }

    @Override
    public void registerAdmin(RequestLogin request) {
        if (registerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email sudah digunakan");
        }

        User admin = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(ERole.ADMIN)
                .build();

        registerRepository.save(admin);
    }
}
