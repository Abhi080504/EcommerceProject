package com.ecommerceproject.user.controller;

import com.ecommerceproject.user.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public ApiResponse<String> homeController() {
        return new ApiResponse<>(true, "Welcome to User Service Microservice", "Success", 200);
    }

    @GetMapping("/db-check")
    public ApiResponse<String> dbCheck() {
        return new ApiResponse<>(true, "User Service DB is Connected", "OK", 200);
    }
}
