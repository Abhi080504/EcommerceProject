package com.ecommerceproject.request;

import lombok.Data;

@Data
public class LoginRequest {
    @jakarta.validation.constraints.NotBlank(message = "Email is required")
    @jakarta.validation.constraints.Email(message = "Invalid email format")
    @jakarta.validation.constraints.Size(max = 50, message = "Email too long")
    private String email;

    @jakarta.validation.constraints.NotBlank(message = "OTP is required")
    @jakarta.validation.constraints.Size(max = 10, message = "Invalid OTP")
    private String otp;
}
