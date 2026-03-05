package com.ecommerceproject.auth.response;

import com.ecommerceproject.auth.domain.USER_ROLE;
import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String refreshToken;
    private String message;
    private USER_ROLE role;
}
