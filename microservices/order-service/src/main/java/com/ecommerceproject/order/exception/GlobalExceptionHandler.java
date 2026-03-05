package com.ecommerceproject.order.exception;

import com.ecommerceproject.order.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception e) {
        ApiResponse<String> res = new ApiResponse<>(false, e.getMessage(), null, HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }
}
