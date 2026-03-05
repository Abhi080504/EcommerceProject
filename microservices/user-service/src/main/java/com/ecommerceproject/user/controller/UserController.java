package com.ecommerceproject.user.controller;

import com.ecommerceproject.user.modal.Address;
import com.ecommerceproject.user.modal.User;
import com.ecommerceproject.user.response.ApiResponse;
import com.ecommerceproject.user.service.AddressService;
import com.ecommerceproject.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AddressService addressService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> getUserByIdHandler(@PathVariable Long userId) throws Exception {
        User user = userService.findUserById(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "User found", user, 200));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getUserProfileHandler(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestHeader(value = "X-User-Roles", required = false) String roles,
            @RequestHeader(value = "Authorization", required = false) String authHeader) throws Exception {
        System.out.println("USER-SERVICE: getUserProfileHandler called");
        System.out.println("USER-SERVICE: X-User-Id: " + userId + ", Roles: " + roles);

        // Security check: Sellers should not access user-service profiles
        if (roles != null && roles.contains("ROLE_SELLER")) {
            System.out.println("🛑 [USER-SERVICE] Access Denied: Seller role detected for user profile request.");
            return ResponseEntity.status(403)
                    .body(new ApiResponse<>(false, "Sellers cannot access user profiles. Use seller profile endpoint.",
                            null, 403));
        }

        if (userId == null) {
            System.out.println("USER-SERVICE: userId is NULL! Denying access.");
            return ResponseEntity.status(401)
                    .body(new ApiResponse<>(false, "User context missing", null, 401));
        }

        User user = userService.findUserById(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "User profile retrieved", user, 200));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<Address>> createAddressHandler(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Address address) throws Exception {
        User user = userService.findUserById(userId);
        Address createdAddress = addressService.createAddress(address, user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Address added successfully", createdAddress, 201));
    }

    @PatchMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<Address>> updateAddressHandler(
            @PathVariable Long addressId,
            @RequestBody Address address) throws Exception {
        Address updatedAddress = addressService.updateAddress(addressId, address);
        return ResponseEntity.ok(new ApiResponse<>(true, "Address updated successfully", updatedAddress, 200));
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<String>> deleteAddressHandler(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long addressId) throws Exception {
        User user = userService.findUserById(userId);
        addressService.deleteAddress(addressId, user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Address deleted successfully", null, 200));
    }
}
