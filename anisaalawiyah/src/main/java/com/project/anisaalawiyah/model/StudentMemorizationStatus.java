package com.project.anisaalawiyah.model;

import java.time.LocalDate;

import org.hibernate.annotations.Where;

import com.project.anisaalawiyah.base.ASoftDeletable;
import com.project.anisaalawiyah.enums.EMemorizationStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@SuppressWarnings("deprecation")
@Where(clause = "row_status = 1")
public class StudentMemorizationStatus extends ASoftDeletable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private EMemorizationStatus status;

    private LocalDate updatedAt;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "surah_id")
    private Surah surah;
}
