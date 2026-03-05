package com.ecommerceproject.product.controller;

import com.ecommerceproject.product.exception.ProductException;
import com.ecommerceproject.product.modal.Product;
import com.ecommerceproject.product.request.CreateProductRequest;
import com.ecommerceproject.product.response.ApiResponse;
import com.ecommerceproject.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sellers/products")
public class SellerProductController {
    private final ProductService productService;
    private final com.ecommerceproject.product.repository.SellerRepository sellerRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Product>>> getProductBySellerId(
            @RequestHeader(value = "X-Seller-Id", required = false) Long sellerId,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        System.out.println("📦 [SellerProductController] GET /sellers/products — X-Seller-Id: " + sellerId
                + ", X-User-Email: " + userEmail);

        // Fallback: if X-Seller-Id is missing, try to resolve from X-User-Email
        if (sellerId == null && userEmail != null && !userEmail.isBlank()) {
            // Strip "seller_" prefix if present (Gateway passes JWT email which may have it)
            String cleanEmail = userEmail.startsWith("seller_") ? userEmail.substring(7) : userEmail;
            System.out.println("🔄 [SellerProductController] Resolving seller ID from email: " + cleanEmail);
            var seller = sellerRepository.findByEmailIgnoreCase(cleanEmail);
            if (seller != null) {
                sellerId = seller.getId();
                System.out.println("✅ [SellerProductController] Resolved seller ID: " + sellerId);
            } else {
                System.out.println("❌ [SellerProductController] No seller found for email: " + cleanEmail);
            }
        }

        if (sellerId == null) {
            System.out.println("❌ [SellerProductController] X-Seller-Id header is MISSING and fallback failed!");
            ApiResponse<Page<Product>> response = new ApiResponse<>(false, "Seller ID missing in headers", null,
                    HttpStatus.UNAUTHORIZED.value());
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        Page<Product> products = productService.getProductBySellerId(sellerId, pageNumber, pageSize);
        System.out.println("✅ [SellerProductController] Found " + products.getTotalElements() + " products for seller "
                + sellerId);
        ApiResponse<Page<Product>> response = new ApiResponse<>(true, "Seller Products Retrieved", products,
                HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            @RequestHeader(value = "X-Seller-Id", required = false) Long sellerId) {

        if (sellerId == null) {
            return new ResponseEntity<>(new ApiResponse<>(false, "Seller ID missing", null, 401),
                    HttpStatus.UNAUTHORIZED);
        }

        Product product = productService.createProduct(request, sellerId);
        ApiResponse<Product> response = new ApiResponse<>(true, "Product Created Successfully", product,
                HttpStatus.CREATED.value());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(
            @PathVariable Long productId,
            @RequestHeader(value = "X-Seller-Id", required = false) Long sellerId) {
        if (sellerId == null) {
            return new ResponseEntity<>(new ApiResponse<>(false, "Seller ID missing", null, 401),
                    HttpStatus.UNAUTHORIZED);
        }
        try {
            productService.deleteProduct(productId, sellerId);
            return new ResponseEntity<>(new ApiResponse<>(true, "Product Deleted Successfully", null, 200),
                    HttpStatus.OK);
        } catch (ProductException e) {
            return new ResponseEntity<>(new ApiResponse<>(false, e.getMessage(), null, 404), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody CreateProductRequest request,
            @RequestHeader(value = "X-Seller-Id", required = false) Long sellerId) throws ProductException {
        if (sellerId == null) {
            return new ResponseEntity<>(new ApiResponse<>(false, "Seller ID missing", null, 401),
                    HttpStatus.UNAUTHORIZED);
        }
        Product updatedProduct = productService.updateProduct(productId, request, sellerId);
        ApiResponse<Product> response = new ApiResponse<>(true, "Product Updated Successfully", updatedProduct, 200);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
