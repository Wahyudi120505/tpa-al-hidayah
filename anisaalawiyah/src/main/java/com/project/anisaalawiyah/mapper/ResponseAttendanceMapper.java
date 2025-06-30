package com.project.anisaalawiyah.mapper;



import com.project.anisaalawiyah.model.Attendance;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.project.anisaalawiyah.dto.response.ResponseAttendance;

@Component
@Service
@RequiredArgsConstructor
public class ResponseAttendanceMapper extends ADATAMapper<Attendance, ResponseAttendance> {
private final ResponseStudentMapper responseStudentMapper;
    public ResponseAttendance convert(Attendance attendance) {
    
        return ResponseAttendance.builder()
                .id(attendance.getId())
                .status(attendance.getStatus())
                .date(attendance.getDate())
                .responseStudent(responseStudentMapper.convert(attendance.getStudent())) 
                .build();
    }
} 