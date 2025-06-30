package com.project.anisaalawiyah.dto.request;

import java.time.LocalDate;

import com.project.anisaalawiyah.enums.EMemorizationStatus;

public record RequestStudentMemorizationStatus(
        EMemorizationStatus status,
        LocalDate updatedAt,
        Long studentId,
        Long surahId
) {
}