package com.project.anisaalawiyah.mapper;

import org.springframework.stereotype.Component;
import com.project.anisaalawiyah.dto.response.ResponseStudent;
import com.project.anisaalawiyah.model.Student;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ResponseStudentMapper {

    private final ResponseParentMapper  responseParentMapper;
    
    public ResponseStudent convert(Student student) {
    
        return ResponseStudent.builder()
                .id(student.getId())
                .name(student.getName())
                .gender(student.getGender())
                .birthDate(student.getBirthDate())
                .classLevel(student.getClassLevel())
                 .responeParent(
                student.getParent() != null 
                    ? responseParentMapper.convert(student.getParent()) 
                    : null
            )
                .build();
    }
} 