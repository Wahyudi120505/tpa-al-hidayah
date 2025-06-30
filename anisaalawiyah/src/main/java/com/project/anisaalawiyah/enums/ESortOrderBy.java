package com.project.anisaalawiyah.enums;

public enum ESortOrderBy {
    ASC("ASC"),
    DESC("DESC");
    private final String name;

    ESortOrderBy(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
