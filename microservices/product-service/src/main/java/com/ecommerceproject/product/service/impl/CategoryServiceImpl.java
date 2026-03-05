package com.ecommerceproject.product.service.impl;

import com.ecommerceproject.product.modal.Category;
import com.ecommerceproject.product.repository.CategoryRepository;
import com.ecommerceproject.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) throws Exception {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Category not found with id: " + id));
    }

    @Override
    public void deleteCategory(Long id) throws Exception {
        categoryRepository.deleteById(id);
    }
}
