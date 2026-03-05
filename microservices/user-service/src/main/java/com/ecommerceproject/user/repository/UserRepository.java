package com.ecommerceproject.user.repository;

import com.ecommerceproject.user.domain.USER_ROLE;
import com.ecommerceproject.user.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    List<User> findByRole(USER_ROLE role);

    long countByRole(USER_ROLE role);
}
