package com.ecommerceproject.controller;

import com.ecommerceproject.domain.AccountStatus;
import com.ecommerceproject.exceptions.SellerException;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.modal.SellerReport;
import com.ecommerceproject.modal.VerificationCode;
import com.ecommerceproject.repository.SellerRepository;
import com.ecommerceproject.repository.VerificationCodeRepository;
import com.ecommerceproject.request.LoginRequest;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.response.AuthResponse;
import com.ecommerceproject.service.AuthService;
import com.ecommerceproject.service.EmailService;
import com.ecommerceproject.service.SellerReportService;
import com.ecommerceproject.service.SellerService;
import com.ecommerceproject.util.OtpUtil;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sellers")
public class SellerController {

        private final SellerService sellerService;
        private final VerificationCodeRepository verificationCodeRepository;
        private final AuthService authService;
        private final EmailService emailService;
        private final SellerReportService sellerReportService;
        private final SellerRepository sellerRepository;

        @PostMapping("/login")
        public ResponseEntity<ApiResponse<AuthResponse>> loginSeller(@Valid @RequestBody LoginRequest req) {

                req.setEmail("seller_" + req.getEmail());
                AuthResponse authResponse = authService.signing(req);

                org.springframework.http.ResponseCookie cookie = createCookie("jwt", authResponse.getJwt());

                ApiResponse<AuthResponse> response = new ApiResponse<>(true, "Seller Login Successful", authResponse,
                                HttpStatus.OK.value());

                return ResponseEntity.ok()
                                .header(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString())
                                .body(response);
        }

        private org.springframework.http.ResponseCookie createCookie(String name, String value) {
                return org.springframework.http.ResponseCookie.from(name, value)
                                .httpOnly(true)
                                .secure(false) // Set to true in production (HTTPS)
                                .path("/")
                                .maxAge(24 * 60 * 60) // 1 day
                                .sameSite("Strict")
                                .build();
        }

        @PatchMapping("/verify/{otp}")
        public ResponseEntity<ApiResponse<Seller>> verifySellerEmail(@PathVariable String otp) throws Exception {
                VerificationCode verificationCode = verificationCodeRepository.findByOtp(otp);

                if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
                        throw new Exception("Wrong OTP...");
                }

                Seller seller = sellerService.verifyEmail(verificationCode.getEmail(), otp);
                ApiResponse<Seller> response = new ApiResponse<>(true, "Email Verified Successfully", seller,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PostMapping
        public ResponseEntity<ApiResponse<Seller>> createSeller(@Valid @RequestBody Seller seller)
                        throws Exception, MessagingException {
                Seller savedSeller = sellerService.createSeller(seller);

                String otp = seller.getOtp();
                if (otp != null) {
                        VerificationCode verificationCode = verificationCodeRepository.findByEmail(seller.getEmail());
                        if (verificationCode != null && verificationCode.getOtp().equals(otp)) {
                                savedSeller.setEmailVerified(true);
                                savedSeller.setAccountStatus(AccountStatus.PENDING_VERIFICATION);
                                verificationCodeRepository.delete(verificationCode);
                                sellerRepository.save(savedSeller);

                                ApiResponse<Seller> response = new ApiResponse<>(true,
                                                "Seller Account Created (Verified)", savedSeller,
                                                HttpStatus.CREATED.value());
                                return new ResponseEntity<>(response, HttpStatus.CREATED);
                        }
                }

                // Fallback or if OTP not provided
                String newOtp = OtpUtil.generateOtp();
                VerificationCode verificationCode = new VerificationCode();
                verificationCode.setOtp(newOtp);
                verificationCode.setEmail(seller.getEmail());
                verificationCodeRepository.save(verificationCode);

                String subject = "Ecommerce verification code";
                String text = "Welcome to ecommerce, verify account using this link ";
                String frontend_url = "http://localhost:3000/verify-seller/";
                emailService.sendVerificationOtpEmail(seller.getEmail(), verificationCode.getOtp(), subject,
                                text + frontend_url);

                ApiResponse<Seller> response = new ApiResponse<>(true, "Seller Account Created (Verification Pending)",
                                savedSeller, HttpStatus.CREATED.value());
                return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<Seller>> getSellerById(@PathVariable Long id) throws SellerException {
                Seller seller = sellerService.getSellerById(id);
                ApiResponse<Seller> response = new ApiResponse<>(true, "Seller Retrieved", seller,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/profile")
        @PreAuthorize("hasRole('SELLER')")
        public ResponseEntity<ApiResponse<Seller>> getSellerByJwt()
                        throws Exception {
                System.out.println("🔍 SellerController: Requesting seller profile...");
                Seller seller = sellerService.getSellerProfile(null);
                System.out.println(
                                "✅ SellerController: Found seller: " + (seller != null ? seller.getEmail() : "null"));
                ApiResponse<Seller> response = new ApiResponse<>(true, "Seller Profile Retrieved", seller,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/report")
        @PreAuthorize("hasRole('SELLER')")
        public ResponseEntity<ApiResponse<SellerReport>> getSellerReport()
                        throws Exception {
                Seller seller = sellerService.getSellerProfile(null);
                SellerReport report = sellerReportService.getSellerReport(seller);
                ApiResponse<SellerReport> response = new ApiResponse<>(true, "Seller Report Retrieved", report,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping
        @PreAuthorize("hasAnyRole('ADMIN', 'SUPER')")
        public ResponseEntity<ApiResponse<List<Seller>>> getAllSellers(
                        @RequestParam(required = false) AccountStatus status) {
                List<Seller> sellers = sellerService.getAllSellers(status);
                ApiResponse<List<Seller>> response = new ApiResponse<>(true, "Sellers Retrieved", sellers,
                                HttpStatus.OK.value());
                return ResponseEntity.ok(response);
        }

        @PatchMapping()
        @PreAuthorize("hasRole('SELLER')")
        public ResponseEntity<ApiResponse<Seller>> updateSeller(
                        @Valid @RequestBody Seller seller) throws Exception {

                Seller profile = sellerService.getSellerProfile(null);
                Seller updatedSeller = sellerService.updateSeller(profile.getId(), seller);

                ApiResponse<Seller> response = new ApiResponse<>(true, "Seller Updated Successfully", updatedSeller,
                                HttpStatus.OK.value());
                return ResponseEntity.ok(response);
        }

        @GetMapping("/fix-role")
        public ResponseEntity<ApiResponse<Seller>> fixSellerRole(@RequestParam String email) {
                try {
                        System.out.println("🔧 Fixing role for: " + email);
                        Seller seller = sellerRepository.findByEmail(email);
                        if (seller != null) {
                                seller.setRole(com.ecommerceproject.domain.USER_ROLE.ROLE_SELLER);
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