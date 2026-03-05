package com.ecommerceproject.user.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class ProductDTO {
    private Long id;
    private String title;
    private String description;
    private int mrpPrice;
    private int sellingPrice;
    private int discountPercent;
    private int quantity;
    private String color;
    private List<String> images = new ArrayList<>();
    private int numRatings;
    private CategoryDTO category;
    private Long sellerId;
    private String createdDate;
    private String sizes;
}
