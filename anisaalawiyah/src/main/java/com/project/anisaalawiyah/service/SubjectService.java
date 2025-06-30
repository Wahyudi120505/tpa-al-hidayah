package com.project.anisaalawiyah.service;


import com.project.anisaalawiyah.model.Subject;
import org.springframework.data.domain.Page;

import com.project.anisaalawiyah.dto.request.RequestSubject;
import com.project.anisaalawiyah.enums.ESortOrderBy;

import java.util.List;

public interface SubjectService {
    Subject create(RequestSubject request);
    Subject update(Long id, RequestSubject request);
    void delete(Long id);
    Subject findById(Long id);
    Page<Subject> getAll(int page, int size, String query, ESortOrderBy sortOrder, List<String> sortBy);
}
