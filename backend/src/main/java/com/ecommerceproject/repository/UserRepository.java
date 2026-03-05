package com.ecommerceproject.repository;

import com.ecommerceproject.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    long countByRole(com.ecommerceproject.domain.USER_ROLE role);

    java.util.List<User> findByRole(com.ecommerceproject.domain.USER_ROLE role);

}
