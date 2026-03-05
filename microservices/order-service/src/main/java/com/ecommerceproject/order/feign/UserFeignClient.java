package com.ecommerceproject.order.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", url = "http://localhost:9002")
public interface UserFeignClient {

    @GetMapping("/api/users/profile")
    com.ecommerceproject.order.response.ApiResponse<Object> getUserProfile(@RequestHeader("Authorization") String jwt);

}
