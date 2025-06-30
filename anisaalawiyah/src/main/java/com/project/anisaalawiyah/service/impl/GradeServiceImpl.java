package com.project.anisaalawiyah.service.impl;

import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import com.project.anisaalawiyah.dto.request.RequestFindAllGrade;
import com.project.anisaalawiyah.dto.request.RequestGrade;
import com.project.anisaalawiyah.model.Grade;
import com.project.anisaalawiyah.model.Student;
import com.project.anisaalawiyah.model.Subject;
import com.project.anisaalawiyah.repository.GradeRepository;
import com.project.anisaalawiyah.repository.StudentRepository;
import com.project.anisaalawiyah.repository.SubjectRepository;
import com.project.anisaalawiyah.service.GradeService;
import org.apache.logging.log4j.util.Strings;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GradeServiceImpl implements GradeService {
    
    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public Grade create(RequestGrade request) throws ServiceException {
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

      Grade grade = Grade.builder()
            .name(request.name())
            .score(request.score())
            .semester(request.semester())
            .student(student)
            .subject(subject) 
            .build();
        return gradeRepository.save(grade);
    }

    @Override
    public Grade update(Long id, RequestGrade request) throws ServiceException {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        grade.setName(request.name());
        grade.setScore(request.score());
        grade.setSemester(request.semester());

        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        grade.setStudent(student);
        grade.setSubject(subject);

        return gradeRepository.save(grade);
    }

    @Override
    public void delete(Long id) throws ServiceException {
         Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        grade.setRowStatus((byte)0);
        gradeRepository.save(grade);
    }

    @Override
    public Grade findById(Long id) throws ServiceException {
        return gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
    }

    private static Specification<Grade> withQuery(String query) {
        return (root, q, cb) -> Strings.isBlank(query)
            ? null
            : cb.or(
                cb.like(cb.lower(root.get("semester")), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("score").as(String.class)), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%")
            );
    }

    @Override
    public Page<Grade> getAll(RequestFindAllGrade request) throws ServiceException {
 Sort sort = Sort.by(
        request.sortOrder() == com.project.anisaalawiyah.enums.ESortOrderBy.ASC ? Sort.Direction.ASC : Sort.Direction.DESC,
        request.sortBy() != null ? request.sortBy() : "id"
    );

        PageRequest pageable = PageRequest.of(
            request.page() - 1,
            request.size(),
            sort
        );

        Specification<Grade> spec = Specification
            .where(withQuery(request.query()));

        return gradeRepository.findAll(spec, pageable);
    }
}
