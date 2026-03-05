package com.ecommerceproject.repository;

import com.ecommerceproject.modal.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    java.util.List<Category> findByCategoryId(String categoryId);

    Category findByCategoryIdAndParentCategory(String categoryId, Category parent);
}
