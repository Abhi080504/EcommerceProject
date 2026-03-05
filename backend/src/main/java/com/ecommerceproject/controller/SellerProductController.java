package com.ecommerceproject.controller;

import com.ecommerceproject.exceptions.ProductException;
import com.ecommerceproject.exceptions.SellerException;
import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.request.createProductRequest;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.service.ProductService;
import com.ecommerceproject.service.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sellers/products")
@PreAuthorize("hasRole('SELLER')")
public class SellerProductController {
    private final ProductService productService;
    private final SellerService sellerService;

    @GetMapping()
    public ResponseEntity<ApiResponse<Page<Product>>> getProductBySellerId(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) throws ProductException, SellerException {

        Seller seller = sellerService.getSellerProfile(jwt);

        Page<Product> products = productService.getProductBySellerId(seller.getId(), pageNumber, pageSize);

        ApiResponse<Page<Product>> response = new ApiResponse<>(true, "Seller Products Retrieved", products,
                HttpStatus.OK.value());

        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @PostMapping()
    public ResponseEntity<ApiResponse<Product>> createProduct(
            @Valid @RequestBody createProductRequest request,

            @RequestHeader("Authorization") String jwt) throws Exception {

        Seller seller = sellerService.getSellerProfile(jwt);

        Product product = productService.createProduct(request, seller);

        ApiResponse<Product> response = new ApiResponse<>(true, "Product Created Successfully", product,
                HttpStatus.CREATED.value());
        return new ResponseEntity<>(response, HttpStatus.CREATED); // Changed from OK to CREATED
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long productId) {

        try {
            productService.deleteProduct(productId);
            ApiResponse<String> response = new ApiResponse<>(true, "Product Deleted Successfully", null,
                    HttpStatus.OK.value());
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (ProductException e) {
            ApiResponse<String> response = new ApiResponse<>(false, e.getMessage(), null, HttpStatus.NOT_FOUND.value());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            e.printStackTrace();
            ApiResponse<String> response = new ApiResponse<>(false, "Delete failed due to server error", null,
                    HttpStatus.INTERNAL_SERVER_ERROR.value());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long productId,
            @Valid @RequestBody createProductRequest request) throws ProductException {

        Product updatedProduct = productService.updateProduct(productId, request);

        ApiResponse<Product> response = new ApiResponse<>(true, "Product Updated Successfully", updatedProduct,
                HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
}
