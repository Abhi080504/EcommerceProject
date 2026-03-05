package com.ecommerceproject.auth.repository;

import com.ecommerceproject.auth.modal.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
