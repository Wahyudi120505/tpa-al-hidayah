package com.project.anisaalawiyah.mapper;

import com.project.anisaalawiyah.model.Grade;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.project.anisaalawiyah.dto.response.ResponseGrade;
@RequiredArgsConstructor
@Component
@Service
public class ResponseGradeMapper extends ADATAMapper<Grade, ResponseGrade> {
       private final ResponseStudentMapper responseStudentMapper;
       private final ResponseSubjectMapper responseSubjectMapper;
  
    public ResponseGrade convert(Grade grade) {
    
        return ResponseGrade.builder()
                .id(grade.getId())
                .semester(grade.getSemester())
                .score(grade.getScore())
                .responseStudent(responseStudentMapper.convert(grade.getStudent())) 
                .responseSubject(responseSubjectMapper.convert(grade.getSubject()))
                .build();
    }
} 