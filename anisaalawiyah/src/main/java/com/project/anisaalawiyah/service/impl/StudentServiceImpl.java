package com.project.anisaalawiyah.service.impl;

import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.project.anisaalawiyah.dto.request.RequestFindAllStudent;
import com.project.anisaalawiyah.dto.request.RequestStudent;
import com.project.anisaalawiyah.model.Parent;
import com.project.anisaalawiyah.model.Student;
import com.project.anisaalawiyah.repository.ParentRepository;
import com.project.anisaalawiyah.repository.StudentRepository;
import com.project.anisaalawiyah.service.StudentService;

import org.springframework.data.domain.Sort;
import org.apache.logging.log4j.util.Strings;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;

    @Override
    public Student create(RequestStudent requestStudent) throws ServiceException {
        Parent parent = parentRepository.findById(requestStudent.parentId())
                .orElseThrow(() -> new ServiceException("Parent ID not found"));
        Student student = Student.builder()
                .name(requestStudent.name())
                .birthDate(requestStudent.birthDate())
                .gender(requestStudent.gender())
                .status(requestStudent.status())
                .parent(parent)
                .classLevel(requestStudent.classLevel())
                .build();
        return studentRepository.save(student);
    }

    @Override
    public Student update(Long id, RequestStudent requestStudent) throws ServiceException {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ServiceException(id + "not found i"));

        
        student.setName(requestStudent.name());
        student.setBirthDate(requestStudent.birthDate());
        student.setClassLevel(requestStudent.classLevel());
        student.setGender(requestStudent.gender());
        student.setStatus(requestStudent.status());
      

        return studentRepository.save(student);
    }

    @Override
    public Student findById(Long id) throws ServiceException {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ServiceException("id not found"));
    }

    @Override
    public void delete(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ServiceException("id not found"));

        student.setRowStatus((byte) 0);
        studentRepository.save(student);
    }

    
    private static Specification<Student> withQuery(String query) {
        return (root, q, cb) -> {
            if (Strings.isBlank(query)) {
                return null;
            }

            String loweredQuery = "%" + query.trim().toLowerCase() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("name")), loweredQuery),
                    cb.like(cb.lower(root.get("gender")), loweredQuery),
                    cb.like(cb.lower(cb.concat("", root.get("classLevel"))), loweredQuery));

      
        };
    }

   private static Specification<Student> withStatus(Boolean status) {
    return (root, q, cb) -> {
        if (status == null) {
            return null;
        }
        return cb.equal(root.get("status"), status);
    };
}
    @Override
    public Page<Student> getAll(RequestFindAllStudent request) throws ServiceException {
        Sort sort = Sort.by(
                request.sortOrder() == com.project.anisaalawiyah.enums.ESortOrderBy.ASC ? Sort.Direction.ASC
                        : Sort.Direction.DESC,
                request.sortBy() != null ? request.sortBy() : "id");
        PageRequest pageable = PageRequest.of(
                request.page() - 1,
                request.size(),
                sort);

        Specification<Student> spec = Specification
                .where(withQuery(request.query()))
                 .and(withStatus(request.status())); 

        return studentRepository.findAll(spec, pageable);
    }

}
