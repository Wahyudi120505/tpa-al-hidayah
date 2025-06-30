package com.project.anisaalawiyah.mapper;

import com.project.anisaalawiyah.model.Pyment;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.project.anisaalawiyah.dto.response.ResponsePyment;
@Component
@Service
@RequiredArgsConstructor
public class ResponsePymentMapper extends ADATAMapper<Pyment, ResponsePyment> {
    private final ResponseStudentMapper responseStudentMapper;


    public ResponsePyment convert(Pyment pyment) {
        return ResponsePyment.builder()
                .id(pyment.getId())
                .date(pyment.getDate())
                .status(pyment.getStatus())
                .paymentDate(pyment.getPaymentDate())
                .responseStudent(responseStudentMapper.convert(pyment.getStudent()))
                .build();
    }
}
