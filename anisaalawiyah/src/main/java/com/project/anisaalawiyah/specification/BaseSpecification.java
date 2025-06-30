package com.project.anisaalawiyah.specification;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BaseSpecification {
    
    public static <T> Specification<T> searchSpecification(String search, String... fields) {
        return (root, query, cb) -> {
            if (search == null || search.trim().isEmpty()) {
                return cb.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();
            String searchLike = "%" + search.toLowerCase() + "%";

            for (String field : fields) {
                predicates.add(cb.like(cb.lower(root.get(field)), searchLike));
            }

            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }
    public static <T> Specification<T> dateBetween(String fieldName, LocalDate startDate, LocalDate endDate) {
    return (root, query, cb) -> {
        if (startDate != null && endDate != null) {
            return cb.between(root.get(fieldName), startDate, endDate);
        } else if (startDate != null) {
            return cb.greaterThanOrEqualTo(root.get(fieldName), startDate);
        } else if (endDate != null) {
            return cb.lessThanOrEqualTo(root.get(fieldName), endDate);
        } else {
            return cb.conjunction(); // tidak memfilter apa pun
        }
    };
}
} 