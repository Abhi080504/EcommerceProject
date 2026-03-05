package com.ecommerceproject.request;

import lombok.Data;

import java.util.List;

@Data
public class createProductRequest {
    @jakarta.validation.constraints.NotBlank(message = "Title is required")
    private String title;

    @jakarta.validation.constraints.NotBlank(message = "Description is required")
    private String description;

    @jakarta.validation.constraints.Min(value = 0, message = "MRP Price must be non-negative")
    private int mrpPrice;

    @jakarta.validation.constraints.Min(value = 0, message = "Selling Price must be non-negative")
    private int sellingPrice;

    private String color;
    private List<String> images;

    @jakarta.validation.constraints.NotBlank(message = "Category is required")
    private String category;

    private String category2;
    private String category3;

    @jakarta.validation.constraints.Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    private String sizes;

    private String brand;
    private String brandDescription;
}
