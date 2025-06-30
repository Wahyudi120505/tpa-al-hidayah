package com.project.anisaalawiyah.service;

import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Page;

import com.project.anisaalawiyah.dto.request.RequestFindAllStudent;
import com.project.anisaalawiyah.dto.request.RequestStudent;
import com.project.anisaalawiyah.model.Student;

public interface StudentService {
    Student create(RequestStudent request) throws ServiceException;
    Student update(Long id, RequestStudent request) throws ServiceException;
    void delete(Long id) throws ServiceException;
    Student findById(Long id) throws ServiceException;
    Page<Student> getAll(RequestFindAllStudent request) throws ServiceException;
}
