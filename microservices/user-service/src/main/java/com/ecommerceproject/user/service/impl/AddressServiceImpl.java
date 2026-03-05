package com.ecommerceproject.user.service.impl;

import com.ecommerceproject.user.modal.Address;
import com.ecommerceproject.user.modal.User;
import com.ecommerceproject.user.repository.AddressRepository;
import com.ecommerceproject.user.repository.UserRepository;
import com.ecommerceproject.user.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public Address createAddress(Address address, User user) {
        address.setId(0); // Ensure it's a new address
        Address savedAddress = addressRepository.save(address);
        user.getAddresses().add(savedAddress);
        userRepository.save(user);
        return savedAddress;
    }

    @Override
    public Address updateAddress(Long id, Address address) throws Exception {
        Address existingAddress = addressRepository.findById(id)
                .orElseThrow(() -> new Exception("Address not found"));

        existingAddress.setName(address.getName());
        existingAddress.setMobile(address.getMobile());
        existingAddress.setPincode(address.getPincode());
        existingAddress.setAddress(address.getAddress());
        existingAddress.setCity(address.getCity());
        existingAddress.setState(address.getState());
        existingAddress.setLocalcity(address.getLocalcity());

        return addressRepository.save(existingAddress);
    }

    @Override
    public void deleteAddress(Long id, User user) throws Exception {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new Exception("Address not found"));
        user.getAddresses().remove(address);
        userRepository.save(user);
        addressRepository.delete(address);
    }
}
