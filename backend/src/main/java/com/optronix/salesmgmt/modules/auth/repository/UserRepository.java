package com.optronix.salesmgmt.modules.auth.repository;

import com.optronix.salesmgmt.modules.auth.entity.Role;
import com.optronix.salesmgmt.modules.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    default Optional<User> findByUsername(String username) {
        return findByEmail(username);
    }

    boolean existsByEmail(String email);
    List<User> findByManagerId(Long managerId);
    List<User> findByRole(Role role);
}
