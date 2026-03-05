package com.ecommerceproject.controller;

import com.ecommerceproject.domain.USER_ROLE;
import com.ecommerceproject.modal.VerificationCode;
import com.ecommerceproject.request.LoginOtpRequest;
import com.ecommerceproject.request.LoginRequest;
import com.ecommerceproject.request.RefreshTokenRequest;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.response.AuthResponse;
import com.ecommerceproject.response.SignupRequest;
import com.ecommerceproject.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> createUserHandler(@Valid @RequestBody SignupRequest req,
            jakarta.servlet.http.HttpServletResponse response) {
        String jwt = authService.createUser(req);

        response.addCookie(createCookie("jwt", jwt));

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("register success");
        res.setRole(req.getRole() != null ? req.getRole() : USER_ROLE.ROLE_CUSTOMER);
        // refreshToken is not returned by createUser currently, consider adding it in
        // future

        ApiResponse<AuthResponse> responseObj = new ApiResponse<>(true, "Registration Successful", res,
                HttpStatus.OK.value());
        return ResponseEntity.ok(responseObj);
    }

    @PostMapping("/send/login-signup-otp")
    public ResponseEntity<ApiResponse<String>> sendOtpHandler(@Valid @RequestBody LoginOtpRequest req) {
        authService.sendLoginOtp(req.getEmail(), req.getRole());

        ApiResponse<String> response = new ApiResponse<>(true, "OTP sent successfully", null, HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send/signing")
    public ResponseEntity<ApiResponse<AuthResponse>> loginHandler(@Valid @RequestBody LoginRequest req,
            jakarta.servlet.http.HttpServletResponse response) {
        AuthResponse authResponse = authService.signing(req);

        response.addCookie(createCookie("jwt", authResponse.getJwt()));

        ApiResponse<AuthResponse> responseObj = new ApiResponse<>(true, "Login Successful", authResponse,
                HttpStatus.OK.value());
        return ResponseEntity.ok(responseObj);
    }

    @PostMapping("/verify/otp")
    public ResponseEntity<ApiResponse<String>> verifyOtpHandler(@Valid @RequestBody VerificationCode req)
            throws Exception {
        // VerificationCode is a modal, not a DTO, so manually passed? Or should be a
        // generic DTO.
        // For now, I'll keep it as is, but maybe add basic null checks if possible.
        // There is no @Valid here because it's an entity used as DTO (bad practice but
        // out of scope to fix fully).

        authService.verifyOtp(req.getEmail(), req.getOtp());

        ApiResponse<String> response = new ApiResponse<>(true, "OTP Verified Successfully", null,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest req) {
        AuthResponse authResponse = authService.refreshToken(req);

        ApiResponse<AuthResponse> response = new ApiResponse<>(true, "Token Refreshed", authResponse,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            @CookieValue(name = "jwt", required = false) String jwtCookie,
            @RequestHeader(name = "Authorization", required = false) String jwtHeader,
            jakarta.servlet.http.HttpServletResponse response) {

        String jwt = jwtCookie;
        if (jwt == null && jwtHeader != null && jwtHeader.startsWith("Bearer ")) {
            jwt = jwtHeader.substring(7);
        }

        if (jwt != null) {
            authService.logout(jwt);
        }

        // 🔹 CLEAR COOKIE
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        ApiResponse<String> res = new ApiResponse<>(true, "Logged out successfully", null, HttpStatus.OK.value());
        return ResponseEntity.ok(res);
    }

    private jakarta.servlet.http.Cookie createCookie(String name, String value) {
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day
        return cookie;
    }
}
