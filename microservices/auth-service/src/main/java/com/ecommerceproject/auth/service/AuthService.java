package com.ecommerceproject.auth.service;

import com.ecommerceproject.auth.domain.USER_ROLE;
import com.ecommerceproject.auth.request.LoginRequest;
import com.ecommerceproject.auth.request.RefreshTokenRequest;
import com.ecommerceproject.auth.request.SignupRequest;
import com.ecommerceproject.auth.response.AuthResponse;

public interface AuthService {
    String createUser(SignupRequest req);

    void sendLoginOtp(String email, USER_ROLE role);

    void verifyOtp(String email, String otp) throws Exception; // Clean up exception later

    AuthResponse signing(LoginRequest req);

    AuthResponse refreshToken(RefreshTokenRequest req);

    void logout(String token);
}
