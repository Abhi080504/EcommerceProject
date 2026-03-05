package com.ecommerceproject.order.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import com.ecommerceproject.order.modal.SellerDTO;
import com.ecommerceproject.order.response.ApiResponse;

@FeignClient(name = "auth-service", url = "http://localhost:9001")
public interface AuthFeignClient {

    @GetMapping("/api/sellers/profile")
    ApiResponse<SellerDTO> getSellerProfile(@RequestHeader("Authorization") String jwt);

}
