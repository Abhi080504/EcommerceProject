package com.ecommerceproject.product.repository;

import com.ecommerceproject.product.modal.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByCategoryId(String categoryId);
}
