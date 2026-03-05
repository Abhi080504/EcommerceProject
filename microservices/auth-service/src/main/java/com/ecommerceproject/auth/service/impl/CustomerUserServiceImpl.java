package com.ecommerceproject.auth.service.impl;

import com.ecommerceproject.auth.domain.AccountStatus;
import com.ecommerceproject.auth.domain.USER_ROLE;
import com.ecommerceproject.auth.modal.Seller;
import com.ecommerceproject.auth.modal.User;
import com.ecommerceproject.auth.repository.SellerRepository;
import com.ecommerceproject.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerUserServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // 1️⃣ Check for explicit "seller_" prefix
        if (email.startsWith("seller_")) {
            String actualEmail = email.substring(7);
            Seller seller = sellerRepository.findByEmailIgnoreCase(actualEmail);
            if (seller != null) {
                if (seller.getAccountStatus() != AccountStatus.ACTIVE) {
                    throw new UsernameNotFoundException("Seller account is not active");
                }
                // Always use ROLE_SELLER for sellers — they're in the seller table by definition
                return buildUserDetails(seller.getEmail(), seller.getPassword(), USER_ROLE.ROLE_SELLER);
            }
        } else {
            // 2️⃣ Try CUSTOMER
            User user = userRepository.findByEmail(email);
            if (user != null) {
                return buildUserDetails(user.getEmail(), user.getPassword(), user.getRole());
            }

            // 3️⃣ Try SELLER (Fallback for mixed usage)
            Seller seller = sellerRepository.findByEmailIgnoreCase(email);
            if (seller != null) {
                if (seller.getAccountStatus() != AccountStatus.ACTIVE) {
                    throw new UsernameNotFoundException("Seller account is not active");
                }
                return buildUserDetails(seller.getEmail(), seller.getPassword(), USER_ROLE.ROLE_SELLER);
            }
        }

        throw new UsernameNotFoundException("User or Seller not found with email: " + email);
    }

    private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {
        if (role == null) {
            role = USER_ROLE.ROLE_CUSTOMER;
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.name()));

        return new org.springframework.security.core.userdetails.User(
                email,
                password,
                authorities);
    }
}
