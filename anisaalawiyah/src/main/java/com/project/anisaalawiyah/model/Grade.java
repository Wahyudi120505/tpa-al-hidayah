package com.project.anisaalawiyah.model;

import org.hibernate.annotations.Where;

import com.project.anisaalawiyah.base.ASoftDeletable;
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
public class Grade extends ASoftDeletable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String semester;
    private Double score;
    private String name;
    private String academicYear;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
    
}
