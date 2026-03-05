package com.ecommerceproject.request;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    @jakarta.validation.constraints.NotBlank(message = "Refresh Token is required")
    private String refreshToken;
}
