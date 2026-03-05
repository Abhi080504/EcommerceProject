package com.ecommerceproject.exception;

import com.ecommerceproject.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ApiResponse<ErrorDetails>> handleResourceNotFoundException(ResourceNotFoundException ex,
                        WebRequest request) {
                ErrorDetails error = new ErrorDetails("Not Found", ex.getMessage(), java.time.LocalDateTime.now());
                return new ResponseEntity<>(
                                new ApiResponse<>(false, ex.getMessage(), error, HttpStatus.NOT_FOUND.value()),
                                HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ApiResponse<ErrorDetails>> handleBadRequestException(BadRequestException ex,
                        WebRequest request) {
                ErrorDetails error = new ErrorDetails("Bad Request", ex.getMessage(), java.time.LocalDateTime.now());
                return new ResponseEntity<>(
                                new ApiResponse<>(false, ex.getMessage(), error, HttpStatus.BAD_REQUEST.value()),
                                HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
        public ResponseEntity<ApiResponse<String>> handleHttpMessageNotReadableException(
                        org.springframework.http.converter.HttpMessageNotReadableException ex) { ex.printStackTrace(); ex.printStackTrace();
                return new ResponseEntity<>(
                                new ApiResponse<>(false, "Invalid JSON request", null, HttpStatus.BAD_REQUEST.value()),
                                HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
                        MethodArgumentNotValidException ex) {
                Map<String, String> errors = new HashMap<>();
                ex.getBindingResult().getAllErrors().forEach((error) -> {
                        String fieldName = ((FieldError) error).getField();
                        String errorMessage = error.getDefaultMessage();
                        errors.put(fieldName, errorMessage);
                });

                return new ResponseEntity<>(
                                new ApiResponse<>(false, "Validation Failed", errors, HttpStatus.BAD_REQUEST.value()),
                                HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(io.jsonwebtoken.ExpiredJwtException.class)
        public ResponseEntity<ApiResponse<String>> handleExpiredJwtException(io.jsonwebtoken.ExpiredJwtException ex) {
                return new ResponseEntity<>(
                                new ApiResponse<>(false, "Token Expired", null, HttpStatus.UNAUTHORIZED.value()),
                                HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(io.jsonwebtoken.JwtException.class)
        public ResponseEntity<ApiResponse<String>> handleJwtException(io.jsonwebtoken.JwtException ex) {
                return new ResponseEntity<>(
                                new ApiResponse<>(false, "Invalid Token", null, HttpStatus.UNAUTHORIZED.value()),
                                HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
        public ResponseEntity<ApiResponse<String>> handleBadCredentialsException(
                        org.springframework.security.authentication.BadCredentialsException ex) {
                return new ResponseEntity<>(
                                new ApiResponse<>(false, ex.getMessage(), null, HttpStatus.UNAUTHORIZED.value()),
                                HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<ErrorDetails>> handleGlobalException(Exception ex, WebRequest request) {
                // Log the actual error for debugging (secure server-side logging)
                System.err.println("🔥 Unhandled Exception: " + ex.getMessage());
                ex.printStackTrace();

                // Return generic message to client
                ErrorDetails error = new ErrorDetails("Internal Server Error",
                                ex.getMessage(), java.time.LocalDateTime.now());
                return new ResponseEntity<>(
                                new ApiResponse<>(false, ex.getMessage(), error,
                                                HttpStatus.INTERNAL_SERVER_ERROR.value()),
                                HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
