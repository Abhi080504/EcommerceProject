package com.ecommerceproject.auth.request;

import com.ecommerceproject.auth.domain.USER_ROLE;
import lombok.Data;

@Data
public class LoginOtpRequest {
    private String email;
    private USER_ROLE role;
}
