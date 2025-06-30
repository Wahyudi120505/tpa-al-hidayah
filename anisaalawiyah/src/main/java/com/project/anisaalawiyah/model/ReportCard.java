package com.project.anisaalawiyah.model;

import com.project.anisaalawiyah.base.ASoftDeletable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ReportCard extends ASoftDeletable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}                 