package com.project.anisaalawiyah.service.impl;

import java.util.ArrayList;
import java.util.List;



import org.apache.logging.log4j.util.Strings;
import org.hibernate.service.spi.ServiceException;



import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import com.project.anisaalawiyah.dto.request.RequestFindAllGrade;
import com.project.anisaalawiyah.dto.request.RequestGrade;
import com.project.anisaalawiyah.dto.request.RequestGradeDetail;
import com.project.anisaalawiyah.model.Grade;
import com.project.anisaalawiyah.model.GradeDetail;
import com.project.anisaalawiyah.model.Student;
import com.project.anisaalawiyah.model.Subject;
import com.project.anisaalawiyah.repository.GradeRepository;
import com.project.anisaalawiyah.repository.StudentRepository;
import com.project.anisaalawiyah.repository.SubjectRepository;
import com.project.anisaalawiyah.service.GradeService;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;



import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class GradeServiceImpl implements GradeService {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
   

  @Override
public Grade create(RequestGrade request) {
    Student student = studentRepository.findById(request.studentId())
            .orElseThrow(() -> new RuntimeException("Student not found"));

    Grade grade = new Grade();
    grade.setStudent(student);
    grade.setSemester(request.semester());
    grade.setAcademicYear(request.academicYear());

    for (RequestGradeDetail detailReq : request.grades()) {
        Subject subject = subjectRepository.findById(detailReq.subjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        GradeDetail detail = new GradeDetail();
        detail.setStudentGrade(grade);  // pakai setter
        detail.setSubject(subject);
        detail.setScore(detailReq.score());

        grade.getGrades().add(detail);
    }

    return gradeRepository.save(grade);
}

    @Override
    public Grade update(Long gradeId, RequestGrade request) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        grade.setStudent(student);
        grade.setSemester(request.semester());
        grade.setAcademicYear(request.academicYear());

       
        grade.getGrades().clear();

       
        for (RequestGradeDetail detailReq : request.grades()) {
            Subject subject = subjectRepository.findById(detailReq.subjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));

            GradeDetail detail = new GradeDetail();
        detail.setStudentGrade(grade);
        detail.setSubject(subject);
        detail.setScore(detailReq.score());

            grade.getGrades().add(detail);
        }

        return gradeRepository.save(grade);
    }

    @Override
    public void delete(Long gradeId) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
        grade.setRowStatus((byte) 0);
        gradeRepository.save(grade);
    }

    @Override
    public Grade findById(Long gradeId) {
        return gradeRepository.findById(gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
    }

   private static Specification<Grade> withFilters(String query, String semester) {
    return (root, q, cb) -> {
        List<Predicate> predicates = new ArrayList<>();

        // Filter berdasarkan query (nama student)
        if (!Strings.isBlank(query)) {
            predicates.add(
                cb.like(cb.lower(root.get("student").get("name")), "%" + query.toLowerCase() + "%")
            );
        }

        // Filter berdasarkan semester
        if (!Strings.isBlank(semester)) {
            predicates.add(cb.equal(cb.lower(root.get("semester")), semester.toLowerCase()));
        }

        if (predicates.isEmpty()) {
            return null;
        }
        return cb.and(predicates.toArray(new Predicate[0]));
    };
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
        .where(withFilters(request.query(), request.semester()));

    return gradeRepository.findAll(spec, pageable);
}

}
