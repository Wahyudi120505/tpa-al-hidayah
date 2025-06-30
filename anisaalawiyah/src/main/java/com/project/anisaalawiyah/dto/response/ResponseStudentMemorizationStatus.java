package com.project.anisaalawiyah.dto.response;

import java.time.LocalDate;


import com.project.anisaalawiyah.enums.EMemorizationStatus;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ResponseStudentMemorizationStatus{
      private  Long id;
       private EMemorizationStatus status;
      private  LocalDate updatedAt;
      private  ResponseStudent responseStudent;
      private  ResponseSurah responseSurah;
}