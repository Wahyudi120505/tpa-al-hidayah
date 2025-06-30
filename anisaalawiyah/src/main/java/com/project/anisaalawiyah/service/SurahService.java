package com.project.anisaalawiyah.service;

import org.hibernate.service.spi.ServiceException;

import com.project.anisaalawiyah.dto.request.RequestSurah;
import com.project.anisaalawiyah.model.Surah;
import org.springframework.data.domain.Page;


public interface SurahService {
    Surah create(RequestSurah request) throws ServiceException;
    Surah update(Long id, RequestSurah request) throws ServiceException;
    void delete(Long id);
    Surah findById(Long id) throws ServiceException;
    Page<Surah> getAll(int page, int size, String query);
}

