package com.project.anisaalawiyah.service;

import com.project.anisaalawiyah.dto.request.RequestFindAllParent;
import com.project.anisaalawiyah.dto.request.RequestParent;
import com.project.anisaalawiyah.exception.ServiceException;
import com.project.anisaalawiyah.model.Parent;
import org.springframework.data.domain.Page;

public interface ParentService {
    Parent findById(Long id) throws ServiceException;
    Parent create(RequestParent request) throws ServiceException;
    Parent update(Long id, RequestParent request) throws ServiceException;
    void delete(Long id) throws ServiceException;
    Page<Parent> getAll(RequestFindAllParent request) throws ServiceException;
}
