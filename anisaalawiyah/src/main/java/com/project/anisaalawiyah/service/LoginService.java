package com.project.anisaalawiyah.service;

import com.project.anisaalawiyah.dto.request.RequestLogin;
import com.project.anisaalawiyah.dto.response.ResponLogin;

public interface LoginService {
  ResponLogin login(RequestLogin loginRequestDto);

    String verifyToken(String idToken);

    void registerAdmin(RequestLogin request);
}
