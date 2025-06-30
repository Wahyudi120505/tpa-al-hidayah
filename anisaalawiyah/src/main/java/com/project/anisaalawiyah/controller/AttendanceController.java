package com.project.anisaalawiyah.controller;

import com.project.anisaalawiyah.dto.request.RequestFindAllAttendance;
import com.project.anisaalawiyah.dto.response.ResponseAttendance;
import com.project.anisaalawiyah.dto.request.RequestAttendance;
import com.project.anisaalawiyah.mapper.ResponseAttendanceMapper;
import com.project.anisaalawiyah.model.Attendance;
import com.project.anisaalawiyah.service.AttendanceService;
import com.project.anisaalawiyah.enums.ESortOrderBy;
import com.project.anisaalawiyah.enums.EStudentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/attendances")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final ResponseAttendanceMapper responseAttendanceMapper;

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "ASC") ESortOrderBy sortOrder,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) EStudentStatus status) {
        try {
            RequestFindAllAttendance request = new RequestFindAllAttendance(page, size, query, sortOrder, sortBy,
                    startDate, endDate, status);
            Page<Attendance> result = attendanceService.getAll(request);
            Page<ResponseAttendance> response = result.map(responseAttendanceMapper::convert);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Gagal mengambil daftar kehadiran: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            Attendance attendance = attendanceService.findById(id);
            return ResponseEntity.ok(responseAttendanceMapper.convert(attendance));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Kehadiran dengan ID " + id + " tidak ditemukan: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RequestAttendance request) {
        try {
            Attendance attendance = attendanceService.create(request);
            return ResponseEntity.ok(responseAttendanceMapper.convert(attendance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Gagal membuat data kehadiran: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RequestAttendance request) {
        try {
            Attendance attendance = attendanceService.update(id, request);
            return ResponseEntity.ok(responseAttendanceMapper.convert(attendance));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Gagal memperbarui kehadiran dengan ID " + id + ": " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            attendanceService.delete(id);
            return ResponseEntity.ok("Berhasil menghapus kehadiran dengan ID " + id);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Gagal menghapus kehadiran dengan ID " + id + ": " + e.getMessage());
        }
    }
}
