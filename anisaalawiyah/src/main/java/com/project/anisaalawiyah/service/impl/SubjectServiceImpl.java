package com.project.anisaalawiyah.service.impl;

import com.project.anisaalawiyah.dto.request.RequestSubject;
import com.project.anisaalawiyah.enums.ESortOrderBy;
import com.project.anisaalawiyah.model.Subject;
import com.project.anisaalawiyah.repository.SubjectRepository;
import com.project.anisaalawiyah.service.SubjectService;

import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    @Override
    public Subject create(RequestSubject request) {
        return subjectRepository.save(Subject.builder().name(request.name()).build());
    }

    @Override
    public Subject update(Long id, RequestSubject request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        subject.setName(request.name());
        return subjectRepository.save(subject);
    }

    @Override
    public void delete(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        subject.setRowStatus((byte) 0);
        subjectRepository.save(subject);
    }

    @Override
    public Subject findById(Long id) {
        return subjectRepository.findById(id).orElseThrow(() -> new RuntimeException("Subject not found"));
    }

    @Override
    public Page<Subject> getAll(int page, int size, String query, ESortOrderBy sortOrder, List<String> sortBy) {
        Sort sort = Sort.by(sortOrder == ESortOrderBy.ASC ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortBy.toArray(new String[0]));
        PageRequest pageable = PageRequest.of(page - 1, size, sort);

        Specification<Subject> spec = (root, q, cb) -> Strings.isBlank(query)
                ? null
                : cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%");

        return subjectRepository.findAll(spec, pageable);
    }
}