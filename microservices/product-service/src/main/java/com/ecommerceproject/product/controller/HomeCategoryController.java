package com.ecommerceproject.product.controller;

import com.ecommerceproject.product.modal.Home;
import com.ecommerceproject.product.modal.HomeCategory;
import com.ecommerceproject.product.response.ApiResponse;
import com.ecommerceproject.product.service.HomeCategoryService;
import com.ecommerceproject.product.service.HomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HomeCategoryController {
    private final HomeCategoryService homeCategoryService;
    private final HomeService homeService;

    @PostMapping("/home/categories")
    public ResponseEntity<ApiResponse<Home>> createHomeCategories(
            @RequestBody List<HomeCategory> homeCategories) {
        List<HomeCategory> categories = homeCategoryService.createCategories(homeCategories);
        Home home = homeService.createHomePageData(categories);
        ApiResponse<Home> response = new ApiResponse<>(true, "Home Categories Created", home, 202);
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @GetMapping("/api/admin/home-category")
    public ResponseEntity<ApiResponse<List<HomeCategory>>> getHomeCategory() {
        List<HomeCategory> categories = homeCategoryService.getAllHomeCategories();
        ApiResponse<List<HomeCategory>> response = new ApiResponse<>(true, "Home Categories Retrieved", categories,
                200);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/home-categories")
    public ResponseEntity<ApiResponse<List<HomeCategory>>> getHomeCategoryPublic() {
        List<HomeCategory> categories = homeCategoryService.getAllHomeCategories();
        ApiResponse<List<HomeCategory>> response = new ApiResponse<>(true, "Home Categories Retrieved", categories,
                200);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/api/home-category/{id}")
    public ResponseEntity<ApiResponse<HomeCategory>> updateHomeCategory(@PathVariable Long id,
            @Valid @RequestBody HomeCategory homeCategory) throws Exception {
        HomeCategory updatedCategory = homeCategoryService.updateHomeCategory(homeCategory, id);
        ApiResponse<HomeCategory> response = new ApiResponse<>(true, "Home Category Updated", updatedCategory, 200);
        return ResponseEntity.ok(response);
    }
}
