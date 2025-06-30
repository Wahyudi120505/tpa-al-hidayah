package com.project.anisaalawiyah.service;

import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Page;


import com.project.anisaalawiyah.dto.request.RequestFindAllPyment;
import com.project.anisaalawiyah.dto.request.RequestPyment;
import com.project.anisaalawiyah.model.Pyment;

public interface PymentService {
    Pyment create(RequestPyment request) throws ServiceException;
    Pyment update(Long id, RequestPyment request) throws ServiceException;
    void delete(Long id) throws ServiceException;
    Pyment getById(Long id)throws ServiceException;
    Page<Pyment> getAll(RequestFindAllPyment request) throws ServiceException;    
}
