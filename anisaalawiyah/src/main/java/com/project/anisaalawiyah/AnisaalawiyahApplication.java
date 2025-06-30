package com.project.anisaalawiyah;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.project.anisaalawiyah")
@EntityScan("com.project.anisaalawiyah.model")
@EnableJpaRepositories("com.project.anisaalawiyah.repository")
@EnableJpaAuditing
public class AnisaalawiyahApplication {
	public static void main(String[] args) {
		SpringApplication.run(AnisaalawiyahApplication.class, args);
	}
}
