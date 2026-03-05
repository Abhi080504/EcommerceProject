package com.ecommerceproject.user.dto;

import lombok.Data;

@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String categoryId;
    private CategoryDTO parentCategory;
    private Integer level;
}
