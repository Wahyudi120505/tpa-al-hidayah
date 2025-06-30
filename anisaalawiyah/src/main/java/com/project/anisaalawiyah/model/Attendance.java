package com.project.anisaalawiyah.model;

import java.time.LocalDate;

import org.hibernate.annotations.Where;

import com.project.anisaalawiyah.base.ASoftDeletable;
import com.project.anisaalawiyah.enums.EStudentStatus;
import jakarta.persistence.*;
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
public class Attendance extends ASoftDeletable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private EStudentStatus status;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
