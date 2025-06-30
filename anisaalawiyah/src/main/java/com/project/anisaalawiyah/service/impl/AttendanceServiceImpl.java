package com.project.anisaalawiyah.service.impl;


import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.project.anisaalawiyah.dto.request.RequestAttendance;
import com.project.anisaalawiyah.dto.request.RequestFindAllAttendance;
import com.project.anisaalawiyah.model.Attendance;
import com.project.anisaalawiyah.repository.AttendanceRepository;
import com.project.anisaalawiyah.service.AttendanceService;

import lombok.RequiredArgsConstructor;

import com.project.anisaalawiyah.model.Student;
import com.project.anisaalawiyah.repository.StudentRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import java.time.LocalDate;
import jakarta.persistence.criteria.Predicate;

import com.project.anisaalawiyah.enums.ESortOrderBy;
import com.project.anisaalawiyah.enums.EStudentStatus;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceServiceImpl  implements AttendanceService{

    private final AttendanceRepository attendanceRepository;
    private  final StudentRepository studentRepository;

    @Override
    public Attendance create(RequestAttendance request) throws ServiceException {
        Student student = studentRepository.findById(request.studentId()).orElseThrow(() -> new ServiceException("id student not found"));

        Attendance attendance =Attendance.builder()
        .date(request.date())
        .status(request.status())
         .student(student)
        .build();
        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance update(Long id, RequestAttendance request) throws ServiceException {
        Attendance attendance = attendanceRepository.findById(id).orElseThrow(()-> new ServiceException("id attendance not found"));
        Student student = studentRepository.findById(request.studentId()).orElseThrow(() -> new ServiceException("id student not found"));

        attendance.setDate(request.date());
        attendance.setStatus(request.status());
        attendance.setStudent(student);
        
        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance findById(Long id) throws ServiceException {
               return attendanceRepository.findById(id).orElseThrow(()-> new ServiceException("id attendance not found"));
    }

    @Override
    public void delete(long id) throws ServiceException {
            Attendance attendance = attendanceRepository.findById(id).orElseThrow(()-> new ServiceException("id attendance not found"));
            attendance.setRowStatus((byte)0);
            attendanceRepository.save(attendance);
    }

    private static Specification<Attendance> withQuery(String query) {
        return (root, q, cb) -> Strings.isBlank(query)
            ? null
            : cb.or(
                cb.like(cb.lower(root.get("date").as(String.class)), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("status")), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("student").get("name")), "%" + query.toLowerCase() + "%")
            );
    }

    private static Specification<Attendance> withDateRange(LocalDate start, LocalDate end) {
        return (root, q, cb) -> {
            Predicate predicate = cb.conjunction();
            if (start != null) predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("date"), start));
            if (end != null) predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("date"), end));
            return predicate;
        };
    }

    private static Specification<Attendance> withStatus(EStudentStatus status) {
        return (root, q, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    @Override
    public Page<Attendance> getAll(RequestFindAllAttendance request) throws ServiceException {
    

      Sort sort = Sort.by(
        request.sortOrder() == ESortOrderBy.ASC ? Sort.Direction.ASC : Sort.Direction.DESC,
        request.sortBy() != null ? request.sortBy() : "id"
    );
        PageRequest pageable = PageRequest.of(
            request.page() - 1,
            request.size(),
            sort
        );

        Specification<Attendance> spec = Specification
            .where(withQuery(request.query()))
            .and(withDateRange(request.startDate(), request.endDate()))
            .and(withStatus(request.status()));

        return attendanceRepository.findAll(spec, pageable);
    }
    
}
