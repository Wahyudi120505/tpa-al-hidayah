package com.project.anisaalawiyah.service;

import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Page;

import com.project.anisaalawiyah.dto.request.RequestFindAllGrade;
import com.project.anisaalawiyah.dto.request.RequestGrade;
import com.project.anisaalawiyah.model.Grade;

public interface GradeService {
    Grade create(RequestGrade request) throws ServiceException;
    Grade update(Long id, RequestGrade request) throws ServiceException;
    void delete(Long id) throws ServiceException;
    Grade findById(Long id) throws ServiceException;
    Page<Grade> getAll(RequestFindAllGrade request) throws ServiceException;
}
