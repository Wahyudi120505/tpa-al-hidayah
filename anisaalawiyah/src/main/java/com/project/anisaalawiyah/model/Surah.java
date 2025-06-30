package com.project.anisaalawiyah.model;

import org.hibernate.annotations.Where;

import com.google.auto.value.AutoValue.Builder;
import com.project.anisaalawiyah.base.ASoftDeletable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
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
public class Surah extends ASoftDeletable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;      
    private Integer number;

}
