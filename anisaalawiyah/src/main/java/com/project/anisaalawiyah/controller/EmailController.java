package com.project.anisaalawiyah.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.anisaalawiyah.service.EmailSchedulerService;

import lombok.RequiredArgsConstructor;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/test-email")
public class EmailController {
        private final EmailSchedulerService schedulerService;

    @PostMapping("/send")
    public ResponseEntity<String> testSend() {
        schedulerService.sendReminderToParents();
        return ResponseEntity.ok("Email sedang dikirim...");
    }
    
}
