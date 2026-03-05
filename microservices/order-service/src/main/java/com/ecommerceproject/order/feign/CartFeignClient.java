package com.ecommerceproject.order.feign;

import com.ecommerceproject.order.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(name = "cart-service", url = "http://localhost:9004") // Using port 9004 for cart-service based on logs
public interface CartFeignClient {

    @GetMapping("/api/cart")
    ApiResponse<Map<String, Object>> getCart(@RequestHeader("X-User-Id") Long userId);
}
