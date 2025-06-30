package com.project.anisaalawiyah.mapper;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.project.anisaalawiyah.dto.response.ResponseParent;
import com.project.anisaalawiyah.model.Parent;

@Component
@Service
public class ResponseParentMapper extends ADATAMapper<Parent,ResponseParent> {

public ResponseParent convert(Parent parent) {
    return  ResponseParent.builder()
        .id(parent.getId())
        .email(parent.getEmail())
        .name(parent.getName())
        .noHp(parent.getNoHp())
        .build();
}

    
}
