package com.ecommerceproject.product.repository;

import com.ecommerceproject.product.modal.HomeCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HomeCategoryRepository extends JpaRepository<HomeCategory, Long> {
}
