package com.project.anisaalawiyah.service;

import org.hibernate.service.spi.ServiceException;
import org.springframework.data.domain.Page;


import com.project.anisaalawiyah.dto.request.RequestAttendance;
import com.project.anisaalawiyah.dto.request.RequestFindAllAttendance;
import com.project.anisaalawiyah.model.Attendance;

public interface AttendanceService {
    Attendance findById(Long id);
    Attendance create(RequestAttendance request);
    Attendance update(Long id, RequestAttendance request);
    void delete(long id) throws ServiceException; 
    Page<Attendance> getAll (RequestFindAllAttendance request) throws ServiceException;
    
}
