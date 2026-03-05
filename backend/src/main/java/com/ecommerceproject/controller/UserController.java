package com.ecommerceproject.controller;

import com.ecommerceproject.modal.User;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @GetMapping("/users/profile")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'SUPER')")
    public ResponseEntity<ApiResponse<User>> createUserHandler()
            throws Exception {

        User user = userService.findUserByJwtToken(null);

        ApiResponse<User> response = new ApiResponse<>(true, "User Profile Retrieved", user, HttpStatus.OK.value());

        return ResponseEntity.ok(response);
    }
}
