package com.ecommerceproject.controller;

import com.ecommerceproject.domain.AccountStatus;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN') or hasRole('SUPER')")
public class AdminController {
    private final SellerService sellerService;

    @PatchMapping("/seller/{id}/status/{status}")
    public ResponseEntity<ApiResponse<Seller>> updateSellerStatus(
            @PathVariable Long id,
            @PathVariable AccountStatus status) throws Exception {

        Seller updatedSeller = sellerService.updateSellerAccountStatus(id, status);

        ApiResponse<Seller> response = new ApiResponse<>(true, "Seller Status Updated", updatedSeller,
                HttpStatus.OK.value());

        return ResponseEntity.ok(response);
    }
}
