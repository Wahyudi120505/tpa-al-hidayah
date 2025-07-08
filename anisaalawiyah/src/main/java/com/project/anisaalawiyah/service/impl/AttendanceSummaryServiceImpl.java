package com.project.anisaalawiyah.service.impl;

import com.project.anisaalawiyah.dto.response.ResponseAttendanceSummary;
import com.project.anisaalawiyah.model.Attendance;
import com.project.anisaalawiyah.model.Student;
import com.project.anisaalawiyah.repository.AttendanceRepository;
import com.project.anisaalawiyah.repository.StudentRepository;
import com.project.anisaalawiyah.service.AttendanceSummaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class AttendanceSummaryServiceImpl implements AttendanceSummaryService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @SuppressWarnings("deprecation")
    @Override
    public ResponseAttendanceSummary getMonthlyAttendanceSummary(Long studentId, int month, int year) {
    
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        List<Attendance> attendances = attendanceRepository.findByStudentIdAndDateBetween(studentId, startDate, endDate);
        int hadirCount = 0;
        int izinCount = 0;
        int alfaCount = 0;
        int sakitCount = 0;

        for (Attendance attendance : attendances) {
            switch (attendance.getStatus()) {
                case HADIR:
                    hadirCount++;
                    break;
                case IZIN:
                    izinCount++;
                    break;
                case ALFA:
                    alfaCount++;
                    break;
                case SAKIT:
                    sakitCount++;
                    break;
            }
        }

        int totalDays = attendances.size();
        double attendancePercentage = totalDays > 0 ? (double) hadirCount / totalDays * 100 : 0.0;

        return ResponseAttendanceSummary.builder()
                .studentId(studentId)
                .studentName(student.getName())
                .month(yearMonth.getMonth().getDisplayName(TextStyle.FULL, new Locale("id", "ID")))
                .year(String.valueOf(year))
                .totalDays(totalDays)
                .hadirCount(hadirCount)
                .izinCount(izinCount)
                .alfaCount(alfaCount)
                .sakitCount(sakitCount)
                .attendancePercentage(Math.round(attendancePercentage * 100.0) / 100.0) // Round to 2 decimal places
                .build();
    }

    @Override
    public ResponseAttendanceSummary getCurrentMonthAttendanceSummary(Long studentId) {
        LocalDate now = LocalDate.now();
        return getMonthlyAttendanceSummary(studentId, now.getMonthValue(), now.getYear());
    }

    @Override
    public List<ResponseAttendanceSummary> getLastMonthsAttendanceSummary(Long studentId, int monthsBack) {
        LocalDate now = LocalDate.now();
        List<ResponseAttendanceSummary> summaries = new java.util.ArrayList<>();

        for (int i = 0; i < monthsBack; i++) {
            LocalDate targetDate = now.minusMonths(i);
            ResponseAttendanceSummary summary = getMonthlyAttendanceSummary(
                    studentId, 
                    targetDate.getMonthValue(), 
                    targetDate.getYear()
            );
            summaries.add(summary);
        }

        return summaries;
    }
} 