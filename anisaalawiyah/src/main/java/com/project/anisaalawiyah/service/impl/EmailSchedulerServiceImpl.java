package com.project.anisaalawiyah.service.impl;

import java.util.List;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import com.project.anisaalawiyah.model.Parent;
import com.project.anisaalawiyah.repository.ParentRepository;
import com.project.anisaalawiyah.service.EmailSchedulerService;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.thymeleaf.context.Context;


@Service
@RequiredArgsConstructor
public class EmailSchedulerServiceImpl implements EmailSchedulerService {

    private final JavaMailSender mailSender;
    private final ParentRepository parentRepository;
    private final TemplateEngine templateEngine;

    @Override
    @Scheduled(cron = "0 0 7 1 * ?") // Setiap tanggal 1 pukul 07:00
    public void sendReminderToParents() {
        List<Parent> parents = parentRepository.findAll();
        for (Parent parent : parents) {
            sendHtmlEmail(parent.getEmail(), parent.getName());
        }
    }

    @Override
    public void sendHtmlEmail(String to, String name) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            Context context = new Context();
            context.setVariable("name", name);
            String htmlContent = templateEngine.process("send-email", context);

            helper.setTo(to);
            helper.setSubject("Pengingat Pembayaran SPP - TPA Al-Hidayah");
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            System.out.println("Email HTML terkirim ke: " + to);
        } catch (Exception e) {
            System.err.println("Gagal kirim email ke: " + to);
            e.printStackTrace();
        }
    }
}
