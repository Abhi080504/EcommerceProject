package com.ecommerceproject.user.service.impl;

import com.ecommerceproject.user.domain.AccountStatus;
import com.ecommerceproject.user.domain.USER_ROLE;
import com.ecommerceproject.user.modal.User;
import com.ecommerceproject.user.repository.UserRepository;
import com.ecommerceproject.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final com.ecommerceproject.user.config.JwtProvider jwtProvider;

    @Override
    public User findUserById(Long id) throws Exception {
        return userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with id: " + id));
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("User not found with email: " + email);
        }
        return user;
    }

    @Override
    public List<User> findAllUsersByRole(USER_ROLE role) {
        return userRepository.findByRole(role);
    }

    @Override
    public User updateUserStatus(Long id, AccountStatus status) throws Exception {
        User user = findUserById(id);
        user.setAccountStatus(status);
        return userRepository.save(user);
    }

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        return findUserByEmail(email);
    }
}
