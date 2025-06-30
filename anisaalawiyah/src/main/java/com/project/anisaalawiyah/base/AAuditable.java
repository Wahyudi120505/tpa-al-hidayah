package com.project.anisaalawiyah.base;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;


import java.util.Date;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Getter
@Setter
public class AAuditable {

    @JsonIgnore
    @CreatedBy
    @Column(name = "created_by", updatable = true, nullable = true) 
    protected Long createdBy;

    @JsonIgnore
    @CreatedDate
    @Column(name = "created_on", nullable = true) 
    protected Date createdOn;

    @JsonIgnore
    @LastModifiedBy
    @Column(name = "modified_by", nullable = true)
    protected Long modifiedBy;

    @JsonIgnore
    @LastModifiedDate
    @Column(name = "modified_on", nullable = true)
    protected Date modifiedOn;
}
