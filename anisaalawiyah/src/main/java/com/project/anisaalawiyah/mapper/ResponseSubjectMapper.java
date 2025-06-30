package com.project.anisaalawiyah.mapper;

import org.springframework.stereotype.Component;
import com.project.anisaalawiyah.dto.response.ResponseSubject;
import com.project.anisaalawiyah.model.Subject;

@Component
public class ResponseSubjectMapper {
    public ResponseSubject convert(Subject subject) {
        return ResponseSubject.builder()
                .id(subject.getId())
                .name(subject.getName())
                .build();
    }
}