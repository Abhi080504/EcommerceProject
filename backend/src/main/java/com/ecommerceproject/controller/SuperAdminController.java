package com.ecommerceproject.controller;

import com.ecommerceproject.domain.AccountStatus;
import com.ecommerceproject.domain.USER_ROLE;

import com.ecommerceproject.repository.SellerRepository;
import com.ecommerceproject.repository.UserRepository;
import com.ecommerceproject.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/super-admin")
public class SuperAdminController {

        private final UserRepository userRepository;
        private final SellerRepository sellerRepository;

        @GetMapping("/dashboard")
        @PreAuthorize("hasRole('SUPER')")
        public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardMetrics() {

                long totalUsers = userRepository.countByRole(USER_ROLE.ROLE_CUSTOMER);
                long totalAdmins = userRepository.countByRole(USER_ROLE.ROLE_ADMIN);
                long totalSellers = sellerRepository.count();
                long activeSellers = sellerRepository.countByAccountStatus(AccountStatus.ACTIVE);
                long pendingSellers = sellerRepository.countByAccountStatus(AccountStatus.PENDING_VERIFICATION);

                Map<String, Object> metrics = new HashMap<>();
                metrics.put("totalUsers", totalUsers);
                metrics.put("totalAdmins", totalAdmins);
                metrics.put("totalSellers", totalSellers);
                metrics.put("activeSellers", activeSellers);
                metrics.put("pendingSellers", pendingSellers);

                ApiResponse<Map<String, Object>> res = new ApiResponse<>(true, "Super Admin Dashboard Metrics", metrics,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(res, HttpStatus.OK);
        }

        @GetMapping("/admins")
        @PreAuthorize("hasRole('SUPER')")
        public ResponseEntity<ApiResponse<java.util.List<com.ecommerceproject.modal.User>>> getAllAdmins() {
                java.util.List<com.ecommerceproject.modal.User> admins = userRepository
                                .findByRole(USER_ROLE.ROLE_ADMIN);
                ApiResponse<java.util.List<com.ecommerceproject.modal.User>> res = new ApiResponse<>(true, "All Admins",
                                admins,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(res, HttpStatus.OK);
        }

        @GetMapping("/customers")
        @PreAuthorize("hasRole('SUPER')")
        public ResponseEntity<ApiResponse<java.util.List<com.ecommerceproject.modal.User>>> getAllCustomers() {
                java.util.List<com.ecommerceproject.modal.User> customers = userRepository
                                .findByRole(USER_ROLE.ROLE_CUSTOMER);
                ApiResponse<java.util.List<com.ecommerceproject.modal.User>> res = new ApiResponse<>(true,
                                "All Customers", customers,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(res, HttpStatus.OK);
        }

        @org.springframework.web.bind.annotation.PatchMapping("/admin/{id}/status/{status}")
        @PreAuthorize("hasRole('SUPER')")
        public ResponseEntity<ApiResponse<com.ecommerceproject.modal.User>> updateAdminStatus(
                        @org.springframework.web.bind.annotation.PathVariable Long id,
                        @org.springframework.web.bind.annotation.PathVariable AccountStatus status) {

                com.ecommerceproject.modal.User admin = userRepository.findById(id)
                                .orElseThrow(() -> new com.ecommerceproject.exceptions.ResourceNotFoundException(
                                                "Admin not found"));

                admin.setAccountStatus(status);
                com.ecommerceproject.modal.User updatedAdmin = userRepository.save(admin);

                ApiResponse<com.ecommerceproject.modal.User> res = new ApiResponse<>(true, "Admin Status Updated",
                                updatedAdmin,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(res, HttpStatus.OK);
        }
}
