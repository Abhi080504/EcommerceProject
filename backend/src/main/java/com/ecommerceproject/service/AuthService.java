package com.ecommerceproject.service;

import com.ecommerceproject.domain.USER_ROLE;
import com.ecommerceproject.request.LoginRequest;
import com.ecommerceproject.response.AuthResponse;
import com.ecommerceproject.response.SignupRequest;

public interface AuthService {

    void sendLoginOtp(String email, USER_ROLE role);

    String createUser(SignupRequest req);

    AuthResponse signing(LoginRequest req);

    void verifyOtp(String email, String otp) throws Exception;

    void logout(String token);

    AuthResponse refreshToken(com.ecommerceproject.request.RefreshTokenRequest req);

}
