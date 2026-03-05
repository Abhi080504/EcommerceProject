package com.ecommerceproject.service;

import com.ecommerceproject.exceptions.ProductException;
import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.request.createProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    public Product createProduct(createProductRequest req, Seller seller);

    public void deleteProduct(Long productId) throws ProductException;

    public Product updateProduct(Long productId, Product product) throws ProductException;

    public Product updateProduct(Long productId, createProductRequest req) throws ProductException;

    Product findProductsById(Long productId) throws ProductException;

    Page<Product> searchProducts(String query, Integer pageNumber, Integer pageSize);

    public Page<Product> getAllProducts(
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

    Page<Product> getProductBySellerId(Long sellerId, Integer pageNumber, Integer pageSize);

}
