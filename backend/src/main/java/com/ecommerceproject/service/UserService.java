package com.ecommerceproject.service;

import com.ecommerceproject.modal.User;

public interface UserService {
    User findUserByJwtToken(String jwt);
    User findUserByEmail(String email);

}
