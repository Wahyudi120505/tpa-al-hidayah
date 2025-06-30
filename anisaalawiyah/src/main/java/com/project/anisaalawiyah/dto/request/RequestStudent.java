package com.project.anisaalawiyah.dto.request;

import java.time.LocalDate;


public record RequestStudent(
 String name,
 String gender,
 LocalDate birthDate,
 String classLevel,
 Long parentId

) {
}
