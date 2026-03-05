package com.ecommerceproject.service.impl;

import com.ecommerceproject.domain.AccountStatus;
import com.ecommerceproject.domain.USER_ROLE;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.repository.SellerRepository;
import com.ecommerceproject.repository.UserRepository;
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

        System.out.println("👤 CustomerUserServiceImpl: Loading user: " + email);

        // 1️⃣ Check for explicit "seller_" prefix
        if (email.startsWith("seller_")) {
            String actualEmail = email.substring(7);
            System.out.println("👤 CustomerUserServiceImpl: Detected seller prefix, actual email: " + actualEmail);
            Seller seller = sellerRepository.findByEmail(actualEmail);
            if (seller != null) {
                if (!seller.getAccountStatus().equals(AccountStatus.ACTIVE)) {
                    System.out.println("👤 CustomerUserServiceImpl: Seller found but inactive.");
                    throw new UsernameNotFoundException("Seller account is not active");
                }
                System.out.println("👤 CustomerUserServiceImpl: Seller found active. Building UserDetails.");
                return buildUserDetails(seller.getEmail(), seller.getPassword(), seller.getRole());
            }
            System.out.println("👤 CustomerUserServiceImpl: Seller not found.");
        } else {
            // 2️⃣ Try CUSTOMER
            User user = userRepository.findByEmail(email);
            if (user != null) {
                System.out.println("👤 CustomerUserServiceImpl: Customer found.");
                return buildUserDetails(user.getEmail(), user.getPassword(), user.getRole());
            }

            // 3️⃣ Try SELLER (Fallback for mixed usage)
            Seller seller = sellerRepository.findByEmail(email);
            if (seller != null) {
                if (!seller.getAccountStatus().equals(AccountStatus.ACTIVE)) {
                    throw new UsernameNotFoundException("Seller account is not active");
                }
                System.out.println("👤 CustomerUserServiceImpl: Seller found (fallback).");
                return buildUserDetails(seller.getEmail(), seller.getPassword(), seller.getRole());
            }
        }

        System.out.println("👤 CustomerUserServiceImpl: User not found!");
        throw new UsernameNotFoundException(
                "User or Seller not found with email: " + email);
    }

    private UserDetails buildUserDetails(
            String email,
            String password,
            USER_ROLE role) {
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
