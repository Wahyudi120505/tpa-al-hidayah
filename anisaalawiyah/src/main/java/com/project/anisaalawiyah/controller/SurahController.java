package com.project.anisaalawiyah.controller;

import com.project.anisaalawiyah.base.GeneralResponse;
import com.project.anisaalawiyah.base.MessageConstant;
import com.project.anisaalawiyah.dto.request.RequestSurah;
import com.project.anisaalawiyah.dto.response.ResponseSurah;
import com.project.anisaalawiyah.mapper.ResponseSurahMapper;
import com.project.anisaalawiyah.model.Surah;
import com.project.anisaalawiyah.service.SurahService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/surah")
@RequiredArgsConstructor
@Slf4j
public class SurahController {

    private final SurahService surahService;
    private final ResponseSurahMapper responseSurahMapper;

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(defaultValue = "1") Integer page,
                                    @RequestParam(defaultValue = "10") Integer size,
                                    @RequestParam(required = false) String query) {
        try {
            Page<Surah> result = surahService.getAll(page, size, query);
            Page<ResponseSurah> response = result.map(responseSurahMapper::convert);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in getAll Surah: ", e);
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            Surah surah = surahService.findById(id);
            return ResponseEntity.ok(responseSurahMapper.convert(surah));
        } catch (Exception e) {
            log.error("Error in findById Surah: ", e);
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RequestSurah request) {
        try {
            Surah surah = surahService.create(request);
            return ResponseEntity.ok(responseSurahMapper.convert(surah));
        } catch (Exception e) {
            log.error("Error in create Surah: ", e);
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RequestSurah request) {
        try {
            Surah surah = surahService.update(id, request);
            return ResponseEntity.ok(responseSurahMapper.convert(surah));
        } catch (Exception e) {
            log.error("Error in update Surah: ", e);
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            surahService.delete(id);
            return ResponseEntity.ok("Berhasil menghapus surah dengan ID " + id);
        } catch (Exception e) {
            log.error("Error in delete Surah: ", e);
            return ResponseEntity.internalServerError()
                    .body(GeneralResponse.error(MessageConstant.INTERNAL_SERVER_ERROR));
        }
    }
}
