package com.project.anisaalawiyah.service.impl;


import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.apache.logging.log4j.util.Strings;

import com.project.anisaalawiyah.dto.request.RequestFindAllParent;
import com.project.anisaalawiyah.dto.request.RequestParent;
import com.project.anisaalawiyah.enums.ERole;
import com.project.anisaalawiyah.model.Parent;
import com.project.anisaalawiyah.model.User;
import com.project.anisaalawiyah.repository.ParentRepository;
import com.project.anisaalawiyah.repository.UserRepository;
import com.project.anisaalawiyah.service.ParentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParentServiceImpl implements ParentService {

    private final ParentRepository parentRepository;
    private final UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;

    @Override
    public Parent findById(Long id) throws ServiceException {
        return parentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parent not found"));
    }
@Override
public Parent create(RequestParent request) {
    // 1. Cek apakah email sudah digunakan
    if (userRepository.findByEmail(request.email()).isPresent()) {
        throw new RuntimeException("Email sudah digunakan");
    }

    // 2. Simpan data parent
    Parent parent = Parent.builder()
            .name(request.name())
            .email(request.email())
            .noHp(request.noHp())
            .build();
    parent = parentRepository.save(parent);

    // 3. Buat akun user
    User user = User.builder()
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .role(ERole.PARENT)
            .parent(parent)
            .build();
    userRepository.save(user);

    return parent;
}

    @Override
    public Parent update(Long id, RequestParent request) throws ServiceException {
        Parent parent = findById(id);
        parent.setName(request.name());
        parent.setEmail(request.email());
        parent.setNoHp(request.noHp());
        return parentRepository.save(parent);
    }

    @Override
    public void delete(Long id) throws ServiceException {
        Parent parent = findById(id);
        parentRepository.delete(parent);
    }

    private static Specification<Parent> withQuery(String query) {
        return (root, q, cb) -> Strings.isBlank(query)
            ? null
            : cb.or(
                cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("email")), "%" + query.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("noHp")), "%" + query.toLowerCase() + "%")
            );
    }

    @Override
    public Page<Parent> getAll(RequestFindAllParent request) throws ServiceException {
 Sort sort = Sort.by(
        request.sortOrder() == com.project.anisaalawiyah.enums.ESortOrderBy.ASC ? Sort.Direction.ASC : Sort.Direction.DESC,
        request.sortBy() != null ? request.sortBy() : "id"
    );
        PageRequest pageable = PageRequest.of(
            request.page() - 1,
            request.size(),
            sort
        );

        Specification<Parent> spec = Specification
            .where(withQuery(request.query()));

        return parentRepository.findAll(spec, pageable);
    }

  
}
