package com.project.anisaalawiyah.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.project.anisaalawiyah.dto.request.RequestFindAllStudentMemorizationStatus;
import com.project.anisaalawiyah.dto.request.RequestStudentMemorizationStatus;
import com.project.anisaalawiyah.model.Student;
import com.project.anisaalawiyah.model.StudentMemorizationStatus;
import com.project.anisaalawiyah.model.Surah;
import com.project.anisaalawiyah.repository.StudentMemorizationStatusRepository;
import com.project.anisaalawiyah.repository.StudentRepository;
import com.project.anisaalawiyah.repository.SurahRepository;
import com.project.anisaalawiyah.service.StudentMemorizationStatusService;


import org.springframework.data.jpa.domain.Specification;
import org.apache.logging.log4j.util.Strings;
import java.time.LocalDate;
import jakarta.persistence.criteria.Predicate;



@Service
@RequiredArgsConstructor
@Slf4j
public class StudentMemorizationStatusServiceImpl implements StudentMemorizationStatusService {

    private final StudentMemorizationStatusRepository memorizationStatusRepository;
    private final StudentRepository studentRepository;
    private final SurahRepository surahRepository;

    @Override
    public StudentMemorizationStatus create(RequestStudentMemorizationStatus request)throws ServiceException  {
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ServiceException("Student ID not found"));

        Surah surah = surahRepository.findById(request.surahId())
                .orElseThrow(() -> new ServiceException("Surah ID not found"));

        StudentMemorizationStatus status = StudentMemorizationStatus.builder()
                .status(request.status())
                .updatedAt(request.updatedAt())
                .student(student)
                .surah(surah)
                .build();

        return memorizationStatusRepository.save(status);
    }

    @Override
    public StudentMemorizationStatus update(Long id, RequestStudentMemorizationStatus request) throws ServiceException {
        StudentMemorizationStatus status = memorizationStatusRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Memorization Status ID not found"));

        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new ServiceException("Student ID not found"));

        Surah surah = surahRepository.findById(request.surahId())
                .orElseThrow(() -> new ServiceException("Surah ID not found"));

        status.setStatus(request.status());
        status.setUpdatedAt(request.updatedAt());
        status.setStudent(student);
        status.setSurah(surah);

        return memorizationStatusRepository.save(status);
    }

    @Override
    public StudentMemorizationStatus findById(Long id)throws ServiceException  {
        return memorizationStatusRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Memorization Status ID not found"));
    }

    @Override
    public void delete(Long id) {
        StudentMemorizationStatus status = memorizationStatusRepository.findById(id)
                .orElseThrow(() -> new ServiceException("Memorization Status ID not found"));
        status.setRowStatus((byte) 0);
        memorizationStatusRepository.save(status);
    }

    private static Specification<StudentMemorizationStatus> withQuery(String query) {
        return (root, q, cb) -> Strings.isBlank(query)
            ? null
            : cb.or(
                cb.like(cb.lower(root.get("status")), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("student").get("name")), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("surah").get("name")), "%" + query.toLowerCase() + "%")
            );
    }

    private static Specification<StudentMemorizationStatus> withUpdatedAtRange(LocalDate start, LocalDate end) {
        return (root, q, cb) -> {
            Predicate predicate = cb.conjunction();
            if (start != null) predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("updatedAt"), start));
            if (end != null) predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("updatedAt"), end));
            return predicate;
        };
    }

    @Override
    public Page<StudentMemorizationStatus> getAll(RequestFindAllStudentMemorizationStatus request)throws ServiceException  {
       Sort sort = Sort.by(
        request.sortOrder() == com.project.anisaalawiyah.enums.ESortOrderBy.ASC ? Sort.Direction.ASC : Sort.Direction.DESC,
        request.sortBy() != null ? request.sortBy() : "id"
    );

        PageRequest pageable = PageRequest.of(
            request.page() - 1,
            request.size(),
            sort
        );

        Specification<StudentMemorizationStatus> spec = Specification
            .where(withQuery(request.query()))
            .and(withUpdatedAtRange(request.startUpdatedAt(), request.endUpdatedAt()));

        return memorizationStatusRepository.findAll(spec, pageable);
    }

  

 

  
}
