package com.ecommerceproject.order.repository;

import com.ecommerceproject.order.modal.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
