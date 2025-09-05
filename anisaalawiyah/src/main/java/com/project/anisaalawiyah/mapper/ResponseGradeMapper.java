package com.project.anisaalawiyah.mapper;

import com.project.anisaalawiyah.model.Grade;
import com.project.anisaalawiyah.model.GradeDetail;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Component;


import com.project.anisaalawiyah.dto.response.GradeDto;
import com.project.anisaalawiyah.dto.response.StudentWithGradesDto;

@Component
@RequiredArgsConstructor
public class ResponseGradeMapper {

    private final ResponseSubjectMapper responseSubjectMapper;

    public GradeDto toGradeDto(GradeDetail detail) {
        return new GradeDto(
            detail.getId(),
            responseSubjectMapper.convert(detail.getSubject()),
            detail.getScore()
        );
    }

    public StudentWithGradesDto convert(Grade grade) {
        List<GradeDto> gradeDtos = grade.getGrades().stream()
                                        .map(this::toGradeDto)
                                        .toList();

        return new StudentWithGradesDto(
            grade.getId(),
            grade.getStudent().getName(),
            grade.getAcademicYear(),
            grade.getSemester(),
            gradeDtos
        );
    }

  
}
