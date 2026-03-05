package com.ecommerceproject.product.controller;

import com.ecommerceproject.product.exception.ProductException;
import com.ecommerceproject.product.modal.Product;
import com.ecommerceproject.product.response.ApiResponse;
import com.ecommerceproject.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

        private final ProductService productService;

        @GetMapping("/{productId}")
        public ResponseEntity<ApiResponse<Product>> getProductById(
                        @PathVariable Long productId) throws ProductException {

                Product product = productService.findProductsById(productId);
                ApiResponse<Product> response = new ApiResponse<>(true, "Product Retrieved", product,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/search")
        public ResponseEntity<ApiResponse<Page<Product>>> searchProduct(
                        @RequestParam(required = false) String query,
                        @RequestParam(defaultValue = "0") Integer pageNumber,
                        @RequestParam(defaultValue = "10") Integer pageSize) {
                Page<Product> products = productService.searchProducts(query, pageNumber, pageSize);
                ApiResponse<Page<Product>> response = new ApiResponse<>(true, "Products Found", products,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping
        public ResponseEntity<ApiResponse<Page<Product>>> getAllProducts(
                        @RequestParam(required = false) String category,
                        @RequestParam(required = false) String brand,
                        @RequestParam(required = false) String color,
                        @RequestParam(required = false) String size,
                        @RequestParam(required = false) Integer minPrice,
                        @RequestParam(required = false) Integer maxPrice,
                        @RequestParam(required = false) Integer minDiscount,
                        @RequestParam(required = false) String sort,
                        @RequestParam(required = false) String stock,
                        @RequestParam(defaultValue = "0") Integer pageNumber,
                        @RequestParam(defaultValue = "10") Integer pageSize) {

                Page<Product> products = productService.getAllProducts(category, brand, color, size, minPrice, maxPrice,
                                minDiscount, sort, stock, pageNumber, pageSize);
                ApiResponse<Page<Product>> response = new ApiResponse<>(true, "Products Retrieved", products,
                                HttpStatus.OK.value());
                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PutMapping("/{productId}/rating")
        public ResponseEntity<Void> updateProductRating(
                        @PathVariable Long productId,
                        @RequestBody java.util.Map<String, Object> ratingData)
                        throws com.ecommerceproject.product.exception.ProductException {

                Double averageRating = Double.valueOf(ratingData.get("averageRating").toString());
                Integer numRatings = Integer.valueOf(ratingData.get("numRatings").toString());

                productService.updateProductRating(productId, averageRating, numRatings);

                return ResponseEntity.ok().build();
        }
}
