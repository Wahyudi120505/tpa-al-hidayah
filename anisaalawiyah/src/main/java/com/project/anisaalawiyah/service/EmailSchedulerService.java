package com.project.anisaalawiyah.service;

public interface EmailSchedulerService {
     void sendReminderToParents();
    void sendHtmlEmail(String to, String name);
    
}
