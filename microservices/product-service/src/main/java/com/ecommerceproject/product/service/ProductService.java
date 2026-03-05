package com.ecommerceproject.product.service;

import com.ecommerceproject.product.exception.ProductException;
import com.ecommerceproject.product.modal.Product;
import com.ecommerceproject.product.request.CreateProductRequest;
import org.springframework.data.domain.Page;

public interface ProductService {
    Product createProduct(CreateProductRequest req, Long sellerId);

    void deleteProduct(Long productId, Long sellerId) throws ProductException;

    Product updateProduct(Long productId, Product product, Long sellerId) throws ProductException;

    Product updateProduct(Long productId, CreateProductRequest req, Long sellerId) throws ProductException;

    Product findProductsById(Long productId) throws ProductException;

    Page<Product> searchProducts(String query, Integer pageNumber, Integer pageSize);

    Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String sizes,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber,
            Integer pageSize);

    Product updateProductRating(Long productId, Double averageRating, Integer numRatings) throws ProductException;

    Page<Product> getProductBySellerId(Long sellerId, Integer pageNumber, Integer pageSize);
}
