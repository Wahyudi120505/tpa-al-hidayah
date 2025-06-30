package com.project.anisaalawiyah.enums;



public enum EReportFileType {
    PDF(".pdf"),
    EXCEL(".xlsx");

    private final String ext;

    EReportFileType(String ext) {
        this.ext = ext;
    }

    public String getExt() {
        return ext;
    }
}
