package com.ecommerceproject.product.service;

import com.ecommerceproject.product.modal.Category;
import java.util.List;

public interface CategoryService {
    Category createCategory(Category category);

    List<Category> getAllCategories();

    Category getCategoryById(Long id) throws Exception;

    void deleteCategory(Long id) throws Exception;
}
