package com.ecommerceproject.user.controller;

import com.ecommerceproject.user.domain.AccountStatus;
import com.ecommerceproject.user.domain.USER_ROLE;
import com.ecommerceproject.user.modal.User;
import com.ecommerceproject.user.repository.SellerRepository;
import com.ecommerceproject.user.repository.UserRepository;
import com.ecommerceproject.user.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/super-admin")
public class SuperAdminController {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;

    @GetMapping("/dashboard")
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
    public ResponseEntity<ApiResponse<List<User>>> getAllAdmins() {
        List<User> admins = userRepository.findByRole(USER_ROLE.ROLE_ADMIN);
        ApiResponse<List<User>> res = new ApiResponse<>(true, "All Admins", admins, HttpStatus.OK.value());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    private final com.ecommerceproject.user.service.UserService userService;

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<User>>> getAllCustomers() {
        List<User> customers = userRepository.findByRole(USER_ROLE.ROLE_CUSTOMER);
        ApiResponse<List<User>> res = new ApiResponse<>(true, "All Customers", customers, HttpStatus.OK.value());
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @org.springframework.web.bind.annotation.PatchMapping("/admin/{id}/status/{status}")
    public ResponseEntity<ApiResponse<User>> updateAdminStatusHandler(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.PathVariable AccountStatus status) throws Exception {
        User updatedAdmin = userService.updateUserStatus(id, status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Admin status updated", updatedAdmin, 200));
    }
}
