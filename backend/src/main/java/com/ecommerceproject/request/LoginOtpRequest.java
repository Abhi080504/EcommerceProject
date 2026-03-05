package com.ecommerceproject.request;

import com.ecommerceproject.domain.USER_ROLE;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class LoginOtpRequest {
    @NotBlank(message = "Email is required")
    private String email;

    private USER_ROLE role;
}
