package com.ecommerceproject.order.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.ecommerceproject.order.modal.ProductDTO;

@FeignClient(name = "product-service", url = "http://localhost:9003")
public interface ProductFeignClient {

    @GetMapping("/api/products/{id}")
    ProductDTO getProductById(@PathVariable("id") Long id);

}
