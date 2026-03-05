package com.ecommerceproject.product.repository;

import com.ecommerceproject.product.modal.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Page<Product> findBySellerId(Long id, Pageable pageable);

    @Query("SELECT p FROM Product p where (:query is null or lower(p.title) " +
            "LIKE lower(concat('%', :query, '%') ) ) " +
            "or (:query is null or lower(p.category.name)" +
            "LIKE lower(concat('%', :query, '%')))")
    Page<Product> searchProduct(@Param("query") String query, Pageable pageable);
}
