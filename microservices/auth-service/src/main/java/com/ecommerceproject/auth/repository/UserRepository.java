package com.ecommerceproject.auth.repository;

import com.ecommerceproject.auth.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
