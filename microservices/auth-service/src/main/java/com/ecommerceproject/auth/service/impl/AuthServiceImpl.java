package com.ecommerceproject.auth.service.impl;

import com.ecommerceproject.auth.config.JwtProvider;
import com.ecommerceproject.auth.domain.AccountStatus;
import com.ecommerceproject.auth.domain.USER_ROLE;
import com.ecommerceproject.auth.modal.Seller;
import com.ecommerceproject.auth.modal.User;
import com.ecommerceproject.auth.repository.SellerRepository;
import com.ecommerceproject.auth.repository.UserRepository;
import com.ecommerceproject.auth.request.LoginRequest;
import com.ecommerceproject.auth.request.RefreshTokenRequest;
import com.ecommerceproject.auth.request.SignupRequest;
import com.ecommerceproject.auth.response.AuthResponse;
import com.ecommerceproject.auth.service.AuthService;
import com.ecommerceproject.auth.service.BlacklistService;
import com.ecommerceproject.auth.service.EmailService;
import com.ecommerceproject.auth.service.RateLimitService;
import com.ecommerceproject.auth.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final EmailService emailService;
    private final CustomerUserServiceImpl customerUserService;
    private final SellerRepository sellerRepository;
    private final RateLimitService rateLimitService;
    private final BlacklistService blacklistService;
    private final org.springframework.data.redis.core.RedisTemplate<String, Object> redisTemplate;

    @Override
    public void logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        blacklistService.blacklistToken(token);
        redisTemplate.delete("session:" + token);
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest req) {
        String refreshToken = req.getRefreshToken();
        // Validate Token (Assume validation passed if not expired)
        // Helper expects Bearer prefix
        String email = jwtProvider.getEmailFromJwtToken("Bearer " + refreshToken);

        // Check if user exists check
        UserDetails userDetails = customerUserService.loadUserByUsername(email);

        // Generate NEW Access Token
        Long id = null;
        if (userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(USER_ROLE.ROLE_SELLER.toString()))) {
            Seller seller = sellerRepository.findByEmailIgnoreCase(email);
            if (seller != null)
                id = seller.getId();
        } else {
            User user = userRepository.findByEmail(email);
            if (user != null)
                id = user.getId();
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                userDetails.getAuthorities());
        String newToken = jwtProvider.generateToken(authentication, id);

        AuthResponse res = new AuthResponse();
        res.setJwt(newToken);
        res.setRefreshToken(refreshToken); // Return same refresh token
        res.setMessage("Token Refreshed");
        res.setRole(USER_ROLE.valueOf(userDetails.getAuthorities().iterator().next().getAuthority()));
        return res;
    }

    private String normalizeEmail(String email) {
        if (email == null)
            return null;
        String normalized = email.trim().toLowerCase();
        int plusIndex = normalized.indexOf("+");
        int atIndex = normalized.indexOf("@");
        if (plusIndex != -1 && atIndex != -1 && plusIndex < atIndex) {
            return normalized.substring(0, plusIndex) + normalized.substring(atIndex);
        }
        return normalized;
    }

    private String sanitizeInput(String input) {
        if (input == null)
            return null;
        // Remove HTML tags using regex
        return input.replaceAll("<[^>]*>", "").trim();
    }

    @Override
    public void sendLoginOtp(String email, USER_ROLE role) {
        email = normalizeEmail(email);

        final String SIGNING_PREFIX = "signin_";
        boolean isSignin = false;

        // 🛡️ Rate Limit Check
        if (rateLimitService.isBlocked(email)) {
            throw new RuntimeException("Too many attempts. Please try again later.");
        }
        rateLimitService.recordAttempt(email);

        // 1️⃣ Detect signin & strip prefix
        if (email.startsWith(SIGNING_PREFIX)) {
            isSignin = true;
            email = email.substring(SIGNING_PREFIX.length());
        }

        // 2️⃣ ONLY block SELLER signin if seller does not exist
        if (isSignin && role == USER_ROLE.ROLE_SELLER) {
            Seller seller = sellerRepository.findByEmail(email);
            if (seller == null) {
                // Silent failure
            } else if (seller.getAccountStatus() != AccountStatus.ACTIVE) {
                // Silent failure or throw
            }
        }

        if (isSignin && role == USER_ROLE.ROLE_ADMIN) {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new BadCredentialsException("Admin not found");
            }
            if (user.getAccountStatus() != AccountStatus.ACTIVE) {
                throw new BadCredentialsException("Account is not active. Please wait for admin approval.");
            }
        }

        // 4️⃣ Generate & save OTP to Redis
        String otp = OtpUtil.generateOtp();
        System.out.println("OTP sent to " + email + " : " + otp);

        // Save to Redis with 5 minutes TTL
        redisTemplate.opsForValue().set("otp:" + email, otp, 5, java.util.concurrent.TimeUnit.MINUTES);

        // 5️⃣ Send email
        try {
            emailService.sendVerificationOtpEmail(
                    email,
                    otp,
                    "Ecommerce Website OTP",
                    "Your OTP is: " + otp);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send OTP: " + e.getMessage());
        }
    }

    @Override
    public String createUser(SignupRequest req) {
        String email = normalizeEmail(req.getEmail());
        req.setEmail(email);

        User user = userRepository.findByEmail(req.getEmail());
        String storedOtp = (String) redisTemplate.opsForValue().get("otp:" + req.getEmail());

        if (storedOtp == null || !storedOtp.equals(req.getOtp())) {
            throw new RuntimeException("Wrong Otp");
        }

        // Clear OTP after successful use
        redisTemplate.delete("otp:" + req.getEmail());

        if (user == null) {
            User createdUser = new User();
            createdUser.setEmail(req.getEmail());
            createdUser.setFullName(sanitizeInput(req.getFullName()));

            createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
            createdUser.setAccountStatus(AccountStatus.ACTIVE);

            createdUser.setMobile(req.getMobile());
            createdUser.setPassword(passwordEncoder.encode(req.getOtp()));

            user = userRepository.save(createdUser);

            // TODO: Create Cart via Cart Service?
            // For now, no cart creation.
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().toString()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(req.getEmail(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication, user.getId());

        // Save Session to Redis (30 mins)
        redisTemplate.opsForValue().set("session:" + token, req.getEmail(), 30, java.util.concurrent.TimeUnit.MINUTES);

        return token;
    }

    @Override
    public void verifyOtp(String email, String otp) throws Exception {
        email = normalizeEmail(email);
        String storedOtp = (String) redisTemplate.opsForValue().get("otp:" + email);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new Exception("Wrong OTP");
        }
        redisTemplate.delete("otp:" + email);
    }

    @Override
    public AuthResponse signing(LoginRequest req) {
        String username = normalizeEmail(req.getEmail());
        String otp = req.getOtp();

        // if (rateLimitService.isBlocked(username)) {
        // throw new RuntimeException("Too many login attempts. Please try again after
        // 15 minutes.");
        // }

        Authentication authentication;
        try {
            authentication = authenticate(username, otp);
        } catch (BadCredentialsException e) {
            rateLimitService.recordAttempt(username);
            throw e;
        }

        rateLimitService.resetAttempts(username);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        Long id = null;
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(USER_ROLE.ROLE_SELLER.toString()))) {
            String cleanEmail = username.startsWith("seller_") ? username.substring(7) : username;
            System.out.println("AUTH-SERVICE-DEBUG: [SIGNING] Searching for Seller: " + cleanEmail);
            Seller seller = sellerRepository.findByEmailIgnoreCase(cleanEmail);
            if (seller != null) {
                id = seller.getId();
                System.out.println("AUTH-SERVICE-DEBUG: [SIGNING] Found Seller ID: " + id);
            } else {
                System.out.println("AUTH-SERVICE-DEBUG: [SIGNING] Seller NOT found for email: " + cleanEmail);
            }
        } else {
            String cleanEmail = username.startsWith("signin_") ? username.substring(7) : username;
            System.out.println("AUTH-SERVICE-DEBUG: [SIGNING] Searching for User: " + cleanEmail);
            User user = userRepository.findByEmail(cleanEmail);
            if (user != null) {
                id = user.getId();
                System.out.println("AUTH-SERVICE-DEBUG: [SIGNING] Found User ID: " + id + ", Role: " + user.getRole());
            } else {
                System.out.println("AUTH-SERVICE-DEBUG: [SIGNING] User NOT found for email: " + cleanEmail);
            }
        }

        System.out.println("AUTH-SERVICE-DEBUG: [SIGNING] Generating token for ID: " + id);
        String token = jwtProvider.generateToken(authentication, id);
        String refreshToken = jwtProvider.generateRefreshToken(authentication);

        redisTemplate.opsForValue().set("session:" + token, username, 30, java.util.concurrent.TimeUnit.MINUTES);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setRefreshToken(refreshToken);
        authResponse.setMessage("Login Successful");

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String roleName = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
        authResponse.setRole(USER_ROLE.valueOf(roleName));

        return authResponse;
    }

    private Authentication authenticate(String email, String otp) {
        String userNameToCheck = email;
        String actualEmail = email;

        if (email.startsWith("signin_")) {
            email = email.substring(7);
            userNameToCheck = email;
            actualEmail = email;
        }

        if (email.startsWith("seller_")) {
            actualEmail = email.substring(7);
            userNameToCheck = email;

            Seller seller = sellerRepository.findByEmail(actualEmail);
            if (seller != null && seller.getAccountStatus() != AccountStatus.ACTIVE) {
                throw new BadCredentialsException("Account is not active. Please wait for admin approval.");
            }
        }

        UserDetails userDetails;
        try {
            userDetails = customerUserService.loadUserByUsername(userNameToCheck);
        } catch (Exception e) {
            System.out.println("❌ Authenticate: User not found: " + userNameToCheck);
            throw new BadCredentialsException("Invalid username or password");
        }

        if (userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(USER_ROLE.ROLE_ADMIN.toString()))) {
            User user = userRepository.findByEmail(actualEmail);
            if (user != null && user.getAccountStatus() != AccountStatus.ACTIVE) {
                throw new BadCredentialsException("Account is not active. Please wait for admin approval.");
            }
        }

        String storedOtp = (String) redisTemplate.opsForValue().get("otp:" + actualEmail);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            System.out.println("❌ Authenticate: OTP mismatch for " + actualEmail + ". Stored: " + storedOtp
                    + ", Provided: " + otp);
            throw new BadCredentialsException("Invalid username or password"); // or Wrong OTP
        }

        redisTemplate.delete("otp:" + actualEmail);

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
    }
}
