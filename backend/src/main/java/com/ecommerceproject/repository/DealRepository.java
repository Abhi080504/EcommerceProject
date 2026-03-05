package com.ecommerceproject.repository;

import com.ecommerceproject.modal.Deals;
import com.ecommerceproject.modal.HomeCategory; // Import needed
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DealRepository extends JpaRepository<Deals, Long> {
    List<Deals> findByCategory(HomeCategory category);
}
