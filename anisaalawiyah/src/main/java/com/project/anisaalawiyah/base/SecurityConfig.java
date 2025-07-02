package com.project.anisaalawiyah.base;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.project.anisaalawiyah.util.JwtFilter;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

   
      @Bean
        PasswordEncoder getPasswordEncoder() {
                return new BCryptPasswordEncoder();
        }

    // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    //     http
    //         .csrf(csrf -> csrf.disable())
    //         .authorizeHttpRequests(auth -> auth
    //             .requestMatchers(
    //                 "/swagger-ui/**",
    //                 "/v3/api-docs/**",
    //                 "/swagger-ui.html",
    //                 "/api/**"  // Mengizinkan semua endpoint yang dimulai dengan /api/
    //             ).permitAll()
    //             .anyRequest().authenticated()
    //         )
    //         .sessionManagement(session -> session
    //             .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
    //         );

    //     return http.build();
    // }
@Autowired
JwtFilter jwtFilter;
    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/swagger-ui/**",
                "/v3/api-docs/**",
                "/swagger-ui.html",
                "/api/auth/**"
            ).permitAll()

            // Hanya untuk PARENT (lihat dan unduh laporan)
            .requestMatchers("/report/**", "/files/**").hasAnyRole("PARENT", "ADMIN")

            // Hanya ADMIN bisa akses semua endpoint /api/**
            .requestMatchers("/api/**").hasRole("ADMIN")

            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

}
