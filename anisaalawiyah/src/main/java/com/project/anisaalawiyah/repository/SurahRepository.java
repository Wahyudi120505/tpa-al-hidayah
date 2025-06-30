package com.project.anisaalawiyah.repository;


import com.project.anisaalawiyah.model.Surah;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
public interface SurahRepository extends JpaRepository<Surah,Long>, JpaSpecificationExecutor<Surah> {
    
}
