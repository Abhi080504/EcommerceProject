package com.ecommerceproject.auth.controller;

import com.ecommerceproject.auth.domain.AccountStatus;
import com.ecommerceproject.auth.modal.Seller;
import com.ecommerceproject.auth.response.ApiResponse;
import com.ecommerceproject.auth.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/super-admin")
public class AdminController {
    private final SellerService sellerService;

    @PatchMapping("/seller/{id}/status/{status}")
    public ResponseEntity<ApiResponse<Seller>> updateSellerStatus(
            @PathVariable Long id,
            @PathVariable AccountStatus status) throws Exception {

        Seller updatedSeller = sellerService.updateSellerAccountStatus(id, status);

        ApiResponse<Seller> response = new ApiResponse<>(true, "Seller Status Updated", updatedSeller, 200);

        return ResponseEntity.ok(response);
    }
}
