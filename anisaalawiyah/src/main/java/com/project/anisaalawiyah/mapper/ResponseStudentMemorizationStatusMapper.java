package com.project.anisaalawiyah.mapper;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.project.anisaalawiyah.dto.response.ResponseStudentMemorizationStatus;
import com.project.anisaalawiyah.model.StudentMemorizationStatus;

import lombok.RequiredArgsConstructor;

@Component
@Service
@RequiredArgsConstructor
public class ResponseStudentMemorizationStatusMapper extends ADATAMapper<StudentMemorizationStatus, ResponseStudentMemorizationStatusMapper> {
    private final ResponseStudentMapper responseStudentMapper;
    private final ResponseSurahMapper responseSurahMapper;

    public ResponseStudentMemorizationStatus convert(StudentMemorizationStatus model) {
        return ResponseStudentMemorizationStatus.builder()
                .id(model.getId())
                .status(model.getStatus())
                .updatedAt(model.getUpdatedAt())
                .responseStudent(responseStudentMapper.convert(model.getStudent()))
                .responseSurah(responseSurahMapper.convert(model.getSurah()))
                .build();
    }
}