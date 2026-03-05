package com.ecommerceproject.product.controller;

import com.ecommerceproject.product.modal.Category;
import com.ecommerceproject.product.response.ApiResponse;
import com.ecommerceproject.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        ApiResponse<List<Category>> response = new ApiResponse<>(
                true,
                "Categories Retrieved Successfully",
                categories,
                HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) throws Exception {
        Category category = categoryService.getCategoryById(id);
        ApiResponse<Category> response = new ApiResponse<>(
                true,
                "Category Retrieved Successfully",
                category,
                HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
