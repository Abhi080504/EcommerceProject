package com.ecommerceproject.repository;

import com.ecommerceproject.modal.HomeCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeCategoryRepository extends JpaRepository<HomeCategory, Long> {
    HomeCategory findByCategoryId(String categoryId);
}
