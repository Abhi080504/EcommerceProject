package com.ecommerceproject.controller;

import com.ecommerceproject.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public ApiResponse<String> HomeControllerHandler() {

        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setMessage("Welcome to the Ecommerce Multivendor");
        apiResponse.setSuccess(true);
        apiResponse.setStatus(200);

        return apiResponse;
    }
}
