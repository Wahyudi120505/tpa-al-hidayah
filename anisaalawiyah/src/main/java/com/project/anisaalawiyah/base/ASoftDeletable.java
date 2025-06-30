package com.project.anisaalawiyah.base;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public class ASoftDeletable extends AAuditable{
    @Column(name = "row_status")
    protected Byte rowStatus = 1;
}
