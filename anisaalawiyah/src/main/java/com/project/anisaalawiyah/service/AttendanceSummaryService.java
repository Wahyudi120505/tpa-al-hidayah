package com.project.anisaalawiyah.service;

import com.project.anisaalawiyah.dto.response.ResponseAttendanceSummary;


import java.util.List;

public interface AttendanceSummaryService {
    
    /**
     * Mendapatkan rekap absensi bulanan untuk seorang siswa
     * @param studentId ID siswa
     * @param month Bulan (1-12)
     * @param year Tahun
     * @return ResponseAttendanceSummary
     */
    ResponseAttendanceSummary getMonthlyAttendanceSummary(Long studentId, int month, int year);
    
    /**
     * Mendapatkan rekap absensi untuk bulan saat ini
     * @param studentId ID siswa
     * @return ResponseAttendanceSummary
     */
    ResponseAttendanceSummary getCurrentMonthAttendanceSummary(Long studentId);
    
    /**
     * Mendapatkan rekap absensi untuk beberapa bulan terakhir
     * @param studentId ID siswa
     * @param monthsBack Jumlah bulan ke belakang
     * @return List of ResponseAttendanceSummary
     */
    List<ResponseAttendanceSummary> getLastMonthsAttendanceSummary(Long studentId, int monthsBack);
} 