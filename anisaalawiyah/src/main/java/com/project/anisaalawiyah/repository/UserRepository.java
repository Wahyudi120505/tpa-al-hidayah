package com.project.anisaalawiyah.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.project.anisaalawiyah.model.User;

public interface UserRepository extends JpaRepository<User,Long>, JpaSpecificationExecutor<User> {
     Optional<User> findByEmail(String email);
}
