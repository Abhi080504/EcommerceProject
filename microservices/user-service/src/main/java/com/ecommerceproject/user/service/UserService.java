package com.ecommerceproject.user.service;

import com.ecommerceproject.user.domain.AccountStatus;
import com.ecommerceproject.user.domain.USER_ROLE;
import com.ecommerceproject.user.modal.User;

import java.util.List;

public interface UserService {
    User findUserById(Long id) throws Exception;

    User findUserByEmail(String email) throws Exception;

    List<User> findAllUsersByRole(USER_ROLE role);

    User updateUserStatus(Long id, AccountStatus status) throws Exception;

    User findUserByJwtToken(String jwt) throws Exception;
}
