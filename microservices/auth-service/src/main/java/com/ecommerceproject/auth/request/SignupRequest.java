package com.ecommerceproject.auth.request;

import com.ecommerceproject.auth.domain.USER_ROLE;
import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String fullName;
    private String mobile;
    private String otp;
    private USER_ROLE role;
}
