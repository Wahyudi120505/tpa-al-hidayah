package com.project.anisaalawiyah.dto.response;


import com.project.anisaalawiyah.enums.EMemorizationStatus;

import lombok.Builder;
import lombok.Data;
@Builder
@Data
public class ResponseSurahStatus {
    private ResponseSurah surah;
    private EMemorizationStatus status;
}
