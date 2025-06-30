package com.project.anisaalawiyah.service.impl;


import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import org.apache.logging.log4j.util.Strings;
import java.time.LocalDate;
import jakarta.persistence.criteria.Predicate;

import com.project.anisaalawiyah.dto.request.RequestFindAllPyment;
import com.project.anisaalawiyah.dto.request.RequestPyment;
import com.project.anisaalawiyah.enums.EPymentStatus;
import com.project.anisaalawiyah.model.Pyment;
import com.project.anisaalawiyah.model.Student;
import com.project.anisaalawiyah.repository.PymentRepository;
import com.project.anisaalawiyah.repository.StudentRepository;
import com.project.anisaalawiyah.service.PymentService;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Slf4j
public class PymentServiceImpl implements PymentService {
   
    private final PymentRepository pymentRepository;
    private final StudentRepository studentRepository;

    @Override
    public Pyment create(RequestPyment request) throws ServiceException {
        Student student = studentRepository.findById(request.student_id())
            .orElseThrow(() -> new RuntimeException("Student not found"));

        Pyment pyment = Pyment.builder()
            .date(request.date())
            .status(request.status())
            .paymentDate(request.paymentDate())
            .student(student)
            .build();

        return pymentRepository.save(pyment);
    }

    @Override
    public Pyment update(Long id, RequestPyment request) throws ServiceException {
        Pyment pyment = pymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pyment not found"));

        Student student = studentRepository.findById(request.student_id())
            .orElseThrow(() -> new RuntimeException("Student not found"));

        pyment.setDate(request.date());
        pyment.setStatus(request.status());
        pyment.setPaymentDate(request.paymentDate());
        pyment.setStudent(student);

        return pymentRepository.save(pyment);
    }

    @Override
    public void delete(Long id)throws ServiceException {
        Pyment pyment = pymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pyment not found"));
        pyment.setRowStatus((byte)0);
        pymentRepository.save(pyment);
    }

    @Override
    public Pyment getById(Long id) throws ServiceException {
        return pymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pyment not found"));
    }

    private static Specification<Pyment> withQuery(String query) {
        return (root, q, cb) -> Strings.isBlank(query)
            ? null
            : cb.or(
                cb.like(cb.lower(root.get("student").get("name")), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("status")), "%" + query.toLowerCase() + "%")
            );
    }

    private static Specification<Pyment> withPaymentDateRange(LocalDate start, LocalDate end) {
        return (root, q, cb) -> {
            Predicate predicate = cb.conjunction();
            if (start != null) predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("paymentDate"), start));
            if (end != null) predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("paymentDate"), end));
            return predicate;
        };
    }

    private static Specification<Pyment> withStatus(EPymentStatus status) {
        return (root, q, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    @Override
    public Page<Pyment> getAll(RequestFindAllPyment request) throws ServiceException {
 Sort sort = Sort.by(
        request.sortOrder() == com.project.anisaalawiyah.enums.ESortOrderBy.ASC ? Sort.Direction.ASC : Sort.Direction.DESC,
        request.sortBy() != null ? request.sortBy() : "id"
    );

        PageRequest pageable = PageRequest.of(request.page() - 1, request.size(), sort);

        Specification<Pyment> spec = Specification
            .where(withQuery(request.query()))
            .and(withPaymentDateRange(request.startDate(), request.endDate()))
            .and(withStatus(request.status()));

        return pymentRepository.findAll(spec, pageable);
    }


  
}
