package com.project.anisaalawiyah.mapper;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.project.anisaalawiyah.dto.response.ResponseSurah;
import com.project.anisaalawiyah.model.Surah;

@Component
@Service
public class ResponseSurahMapper extends ADATAMapper<Surah, ResponseSurah> {
    public ResponseSurah convert(Surah surah) {
        return ResponseSurah.builder()
                .id(surah.getId())
                .name(surah.getName())
                .number(surah.getNumber())
                .build();
    }
}