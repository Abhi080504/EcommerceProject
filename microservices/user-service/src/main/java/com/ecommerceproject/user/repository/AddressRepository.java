package com.ecommerceproject.user.repository;

import com.ecommerceproject.user.modal.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
