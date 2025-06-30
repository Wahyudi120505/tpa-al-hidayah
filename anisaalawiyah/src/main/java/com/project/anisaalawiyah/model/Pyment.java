package com.project.anisaalawiyah.model;

import java.time.LocalDate;

import org.hibernate.annotations.Where;

import com.project.anisaalawiyah.base.ASoftDeletable;
import com.project.anisaalawiyah.enums.EPymentStatus;

import jakarta.persistence.Entity;
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
public class Pyment extends  ASoftDeletable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;                                           
    private EPymentStatus status; 
    private LocalDate paymentDate;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
