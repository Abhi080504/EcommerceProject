package com.ecommerceproject.product.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CreateProductRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @Min(value = 0, message = "MRP Price must be non-negative")
    private int mrpPrice;

    @Min(value = 0, message = "Selling Price must be non-negative")
    private int sellingPrice;

    private String color;
    private List<String> images;

    @NotBlank(message = "Category is required")
    private String category;

    private String category2;
    private String category3;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    private String sizes;

    private String brand;
    private String brandDescription;
}
