package com.ecommerceproject.user.service;

import com.ecommerceproject.user.modal.Address;
import com.ecommerceproject.user.modal.User;

import java.util.List;

public interface AddressService {
    Address createAddress(Address address, User user);

    Address updateAddress(Long id, Address address) throws Exception;

    void deleteAddress(Long id, User user) throws Exception;
}
