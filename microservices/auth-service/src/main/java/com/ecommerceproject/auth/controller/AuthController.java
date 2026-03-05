package com.ecommerceproject.auth.controller;

import com.ecommerceproject.auth.domain.USER_ROLE;
// I need to receive OTP. Can use LoginRequest or a new DTO?
// Monolith used VerificationCode entity as DTO. Bad practice. 
// I will use LoginRequest or create a simple DTO "VerifyOtpRequest".
// Or just reuse LoginRequest since it has email and otp.
import com.ecommerceproject.auth.request.LoginOtpRequest;
import com.ecommerceproject.auth.request.LoginRequest;
import com.ecommerceproject.auth.request.RefreshTokenRequest;
import com.ecommerceproject.auth.request.SignupRequest;
import com.ecommerceproject.auth.response.ApiResponse;
import com.ecommerceproject.auth.response.AuthResponse;
import com.ecommerceproject.auth.service.AuthService;
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
    public ResponseEntity<ApiResponse<AuthResponse>> createUserHandler(@RequestBody SignupRequest req) {
        String jwt = authService.createUser(req);
        // Cookie logic removed for microservice? Or keep it?
        // Keep it if frontend expects it.
        // But for Gateway, gateway might handle cookies? Or just pass through.
        // I will keep logic simple: Return JWT in response. Frontend sets cookie or
        // Gateway sets it?
        // Monolith set cookie.
        // I'll add cookie logic back if needed. For now, response body is sufficient
        // for mobile/modern apps.
        // But web app might rely on cookie.
        // I'll replicate cookie logic to be safe.

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("register success");
        res.setRole(req.getRole() != null ? req.getRole() : USER_ROLE.ROLE_CUSTOMER);

        ApiResponse<AuthResponse> responseObj = new ApiResponse<>(true, "Registration Successful", res,
                HttpStatus.OK.value());
        return ResponseEntity.ok(responseObj);
    }

    @PostMapping("/send/login-signup-otp")
    public ResponseEntity<ApiResponse<String>> sendOtpHandler(@RequestBody LoginOtpRequest req) {
        authService.sendLoginOtp(req.getEmail(), req.getRole());
        ApiResponse<String> response = new ApiResponse<>(true, "OTP sent successfully", null, HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signing")
    public ResponseEntity<ApiResponse<AuthResponse>> loginHandler(@RequestBody LoginRequest req) {
        AuthResponse authResponse = authService.signing(req);
        ApiResponse<AuthResponse> responseObj = new ApiResponse<>(true, "Login Successful", authResponse,
                HttpStatus.OK.value());
        return ResponseEntity.ok(responseObj);
    }

    @PostMapping("/verify/otp")
    public ResponseEntity<ApiResponse<String>> verifyOtpHandler(@RequestBody LoginRequest req) throws Exception {
        // Reusing LoginRequest for email+otp
        authService.verifyOtp(req.getEmail(), req.getOtp());
        ApiResponse<String> response = new ApiResponse<>(true, "OTP Verified Successfully", null,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody RefreshTokenRequest req) {
        AuthResponse authResponse = authService.refreshToken(req);
        ApiResponse<AuthResponse> response = new ApiResponse<>(true, "Token Refreshed", authResponse,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            @RequestHeader(name = "Authorization", required = false) String jwt) {
        if (jwt != null) {
            authService.logout(jwt);
        }
        ApiResponse<String> res = new ApiResponse<>(true, "Logged out successfully", null, HttpStatus.OK.value());
        return ResponseEntity.ok(res);
    }
}
