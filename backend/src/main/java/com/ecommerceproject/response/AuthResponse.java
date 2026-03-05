package com.ecommerceproject.response;

import com.ecommerceproject.domain.USER_ROLE;
import lombok.Data;

@Data
public class AuthResponse {

    private String jwt;
    private String message;
    private String refreshToken;
    private USER_ROLE role;

}
