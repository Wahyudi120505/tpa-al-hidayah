package com.project.anisaalawiyah.dto.response;

import lombok.Builder;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResponseSubject {
    private Long id;
    private String name;

    public ResponseSubject(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
