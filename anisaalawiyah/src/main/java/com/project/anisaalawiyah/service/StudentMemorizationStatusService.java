package com.project.anisaalawiyah.service;


import java.util.List;

import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Page;

import com.project.anisaalawiyah.dto.request.RequestFindAllStudentMemorizationStatus;
import com.project.anisaalawiyah.dto.request.RequestStudentMemorizationStatus;
import com.project.anisaalawiyah.dto.response.ResponseSurahMemorizationStatus;
import com.project.anisaalawiyah.model.StudentMemorizationStatus;

public interface StudentMemorizationStatusService {
    StudentMemorizationStatus create(RequestStudentMemorizationStatus request)throws ServiceException;
    StudentMemorizationStatus update(Long id, RequestStudentMemorizationStatus request)throws ServiceException;
    StudentMemorizationStatus findById(Long id);
    void delete(Long id)throws ServiceException;
    Page<StudentMemorizationStatus> getAll(RequestFindAllStudentMemorizationStatus request)throws ServiceException;
        List<ResponseSurahMemorizationStatus> getAllSurahWithMemorizationStatus(Long studentId);

}
