package com.ecommerceproject.auth.config;

import com.ecommerceproject.auth.service.BlacklistService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.io.IOException;

public class JwtTokenValidator extends OncePerRequestFilter {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(JwtTokenValidator.class);
    private final BlacklistService blacklistService;
    private final SecretKey key;
    private final org.springframework.data.redis.core.RedisTemplate<String, Object> redisTemplate;

    public JwtTokenValidator(BlacklistService blacklistService, String secret,
            org.springframework.data.redis.core.RedisTemplate<String, Object> redisTemplate) {
        this.blacklistService = blacklistService;
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String jwt = request.getHeader("Authorization");

        if (jwt == null && request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    jwt = "Bearer " + cookie.getValue();
                }
            }
        }

        String path = request.getServletPath();
        logger.info("🔹 [JwtTokenValidator] Processing Request Path: {}", path);

        if (jwt == null || !jwt.startsWith("Bearer ") ||
                path.startsWith("/api/auth/") || path.startsWith("/auth/") ||
                path.contains("/auth/send/login-signup-otp") || path.contains("/auth/signing")
                || path.contains("/auth/signup") || path.contains("/api/sellers/login")
                || path.contains("/api/sellers")) {

            logger.info("🔹 [JwtTokenValidator] Skipping validation for public path: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwt = jwt.substring(7);

            if (blacklistService.isBlacklisted(jwt)) {
                throw new Exception("Token is blacklisted");
            }

            if (Boolean.FALSE.equals(redisTemplate.hasKey("session:" + jwt))) {
                throw new Exception("Session expired or invalid");
            }
            redisTemplate.expire("session:" + jwt, 30, java.util.concurrent.TimeUnit.MINUTES);

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            String email = claims.get("email", String.class);
            String authorities = claims.get("authorities", String.class);

            if (authorities == null) {
                authorities = "";
            }

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    AuthorityUtils.commaSeparatedStringToAuthorityList(authorities));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.info("✅ [JwtTokenValidator] Token validated for user: {}", email);

        } catch (Exception e) {
            logger.error("❌ [JwtTokenValidator] Token validation failed: {}", e.getMessage());
            SecurityContextHolder.clearContext(); // Ensure context is clear
        }

        filterChain.doFilter(request, response);
    }
}
