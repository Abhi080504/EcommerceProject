package com.ecommerceproject.auth.controller;

import com.ecommerceproject.auth.domain.AccountStatus;
import com.ecommerceproject.auth.modal.Seller;
import com.ecommerceproject.auth.request.LoginRequest;
import com.ecommerceproject.auth.response.ApiResponse;
import com.ecommerceproject.auth.response.AuthResponse;
import com.ecommerceproject.auth.service.AuthService;
import com.ecommerceproject.auth.service.EmailService;
import com.ecommerceproject.auth.service.SellerService;
import com.ecommerceproject.auth.repository.SellerRepository;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sellers")
public class SellerController {

    private final SellerService sellerService;
    private final AuthService authService;
    private final EmailService emailService;
    private final SellerRepository sellerRepository;
    private final org.springframework.data.redis.core.RedisTemplate<String, Object> redisTemplate;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginSeller(@Valid @RequestBody LoginRequest req) {
        System.out.println("🔍 SellerController: Login request received for " + req.getEmail());

        req.setEmail("seller_" + req.getEmail());
        AuthResponse authResponse = authService.signing(req);

        ApiResponse<AuthResponse> response = new ApiResponse<>(true, "Seller Login Successful", authResponse,
                HttpStatus.OK.value());

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/verify/{otp}")
    public ResponseEntity<ApiResponse<Seller>> verifySellerEmail(@PathVariable String otp) throws Exception {
        // This endpoint was verifying based on OTP. But OTP is associated with email.
        // How do we know the email?
        // In monolith, we used VerificationCodeRepository which found by OTP.
        // With Redis as "otp:email" -> "123456", we can't find email by OTP efficiently
        // without scanning keys.
        // So this endpoint design is problematic with Redis unless we store
        // "otp:123456" -> "email".
        // OR the frontend should pass email too.

        // For now, I will throw exception as this flow is deprecated if we use the POST
        // /sellers with OTP body.
        throw new Exception("Please use the create seller endpoint with OTP");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Seller>> createSeller(@Valid @RequestBody Seller seller)
            throws Exception, MessagingException {

        // Check OTP from Redis
        String email = seller.getEmail();
        String otp = seller.getOtp();

        if (otp != null) {
            String storedOtp = (String) redisTemplate.opsForValue().get("otp:" + email);
            if (storedOtp != null && storedOtp.equals(otp)) {
                seller.setEmailVerified(true);
                redisTemplate.delete("otp:" + email);
            } else {
                throw new Exception("Invalid or Expired OTP");
            }
        } else {
            throw new Exception("OTP is required");
        }

        Seller savedSeller = sellerService.createSeller(seller);

        ApiResponse<Seller> response = new ApiResponse<>(true,
                "Seller Account Created", savedSeller,
                HttpStatus.CREATED.value());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Seller>> getSellerById(@PathVariable Long id) throws Exception {
        Seller seller = sellerService.getSellerById(id);
        ApiResponse<Seller> response = new ApiResponse<>(true, "Seller Retrieved", seller,
                HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/profile")
    // @PreAuthorize("hasRole('SELLER')") // Gateway might handle auth headers, but
    // annotated security is good
    public ResponseEntity<ApiResponse<Seller>> getSellerByJwt(
            @RequestHeader("Authorization") String jwt) throws Exception {
        System.out.println("🔍 SellerController: Requesting seller profile...");
        Seller seller = sellerService.getSellerProfile(jwt);
        System.out.println("✅ SellerController: Found seller: " + (seller != null ? seller.getEmail() : "null"));
        ApiResponse<Seller> response = new ApiResponse<>(true, "Seller Profile Retrieved", seller,
                HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Seller>>> getAllSellers(
            @RequestParam(required = false) AccountStatus status) {
        List<Seller> sellers = sellerService.getAllSellers(status);
        ApiResponse<List<Seller>> response = new ApiResponse<>(true, "Sellers Retrieved", sellers,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @PatchMapping()
    public ResponseEntity<ApiResponse<Seller>> updateSeller(
            @Valid @RequestBody Seller seller,
            @RequestHeader("Authorization") String jwt) throws Exception {

        Seller profile = sellerService.getSellerProfile(jwt);
        Seller updatedSeller = sellerService.updateSeller(profile.getId(), seller);

        ApiResponse<Seller> response = new ApiResponse<>(true, "Seller Updated Successfully", updatedSeller,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    // FIX ROLE ENDPOINT
    @GetMapping("/fix-role")
    public ResponseEntity<ApiResponse<Seller>> fixSellerRole(@RequestParam String email) {
        try {
            System.out.println("🔧 Fixing role for: " + email);
            Seller seller = sellerRepository.findByEmail(email);
            if (seller != null) {
                seller.setRole(com.ecommerceproject.auth.domain.USER_ROLE.ROLE_SELLER);
                seller.setAccountStatus(com.ecommerceproject.auth.domain.AccountStatus.ACTIVE);
                Seller updated = sellerRepository.save(seller);
                System.out.println("✅ Role updated for: " + updated.getEmail());
                return ResponseEntity.ok(new ApiResponse<>(true, "Role Fixed to SELLER", updated, 200));
            }
            return ResponseEntity.ok(new ApiResponse<>(false, "Seller not found", null, 404));
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("❌ Error fixing role: " + e.getMessage());
            return ResponseEntity.ok(new ApiResponse<>(false, "Error: " + e.getMessage(), null, 500));
        }
    }
}
