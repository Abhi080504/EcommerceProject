package com.ecommerceproject.response;

import com.ecommerceproject.domain.USER_ROLE;
import lombok.Data;

@Data
public class SignupRequest {

    @jakarta.validation.constraints.NotBlank(message = "Email is required")
    @jakarta.validation.constraints.Email(message = "Invalid email format")
    @jakarta.validation.constraints.Size(max = 50, message = "Email too long")
    private String email;

    @jakarta.validation.constraints.NotBlank(message = "Full Name is required")
    @jakarta.validation.constraints.Size(max = 50, message = "Name too long")
    private String fullName;

    @jakarta.validation.constraints.NotBlank(message = "OTP is required")
    @jakarta.validation.constraints.Size(max = 10, message = "Invalid OTP")
    private String otp;

    @jakarta.validation.constraints.NotBlank(message = "Mobile is required")
    @jakarta.validation.constraints.Size(max = 15, message = "Mobile too long")
    private String mobile;
    private USER_ROLE role;
}
