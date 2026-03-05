package com.ecommerceproject.cart.feign;

import com.ecommerceproject.cart.modal.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", url = "http://localhost:9003")
public interface ProductFeignClient {

    @GetMapping("/api/products/{id}")
    com.ecommerceproject.cart.response.ApiResponse<ProductDTO> getProductById(@PathVariable("id") Long id);
}
