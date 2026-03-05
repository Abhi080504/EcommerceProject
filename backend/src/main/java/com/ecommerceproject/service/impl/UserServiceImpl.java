package com.ecommerceproject.service.impl;

import com.ecommerceproject.config.JwtProvider;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.repository.UserRepository;
import com.ecommerceproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) {
        // If JWT is null (Cookie Auth), fallback to SecurityContext
        if (jwt == null) {
            org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            if (authentication != null) {
                String email = (String) authentication.getPrincipal();
                // JwtTokenValidator sets principal as email string
                return this.findUserByEmail(email);
            }
            throw new RuntimeException("User not authenticated");
        }

        String email = jwtProvider.getEmailFromJwtToken(jwt);
        return this.findUserByEmail(email);
    }

    @Override
    public User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("user not found with email " + email);
        }

        return user;
    }
}
