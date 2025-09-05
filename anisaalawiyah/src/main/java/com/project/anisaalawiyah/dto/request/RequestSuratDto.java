package com.project.anisaalawiyah.dto.request;

import com.project.anisaalawiyah.enums.EMemorizationStatus;

import lombok.Builder;

@Builder
public record RequestSuratDto(
      Long surahId,
      EMemorizationStatus status
) {
} 