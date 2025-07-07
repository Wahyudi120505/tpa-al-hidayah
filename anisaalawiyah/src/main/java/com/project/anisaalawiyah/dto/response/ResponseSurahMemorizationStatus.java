package com.project.anisaalawiyah.dto.response;



import com.project.anisaalawiyah.enums.EMemorizationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Builder
@Data
public class ResponseSurahMemorizationStatus {
    private Long suratId;
    private ResponseSurah surah;
    private EMemorizationStatus memorizationStatus; 
    private LocalDate updatedAt; 
} 