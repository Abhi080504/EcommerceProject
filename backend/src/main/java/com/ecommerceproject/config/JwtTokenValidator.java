package com.ecommerceproject.config;

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

import javax.crypto.SecretKey;
import java.io.IOException;

import com.ecommerceproject.service.BlacklistService;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;

public class JwtTokenValidator extends OncePerRequestFilter {

    private final BlacklistService blacklistService;
    private final SecretKey key;
    private final org.springframework.data.redis.core.StringRedisTemplate redisTemplate;

    public JwtTokenValidator(BlacklistService blacklistService, String secret,
            org.springframework.data.redis.core.StringRedisTemplate redisTemplate) {
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
        String path = request.getRequestURI();

        if (jwt == null && request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    jwt = "Bearer " + cookie.getValue();
                }
            }
        }

        if (jwt == null || !jwt.startsWith("Bearer ") || request.getServletPath().equals("/api/sellers/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwt = jwt.substring(7);

            if (blacklistService.isBlacklisted(jwt)) {
                throw new Exception("Token is blacklisted");
            }

            // Check Redis Session
            if (Boolean.FALSE.equals(redisTemplate.hasKey("session:" + jwt))) {
                System.out.println("❌ JwtTokenValidator: Session not found in Redis for: " + jwt);
                throw new Exception("Session expired or invalid");
            }
            // Sliding Window: Reset TTL to 30 mins
            redisTemplate.expire("session:" + jwt, 30, java.util.concurrent.TimeUnit.MINUTES);

            // Key is already initialized in constructor

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

            System.out.println(
                    "✅ JwtTokenValidator: Authenticated email: " + email + " with authorities: " + authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            System.out.println("❌ JwtTokenValidator: Token validation failed: " + e.getMessage());
            // Do NOT halt execution. Proceed as anonymous user.
            // Spring Security will handle authorization downstream.
        }

        System.out.println("✅ JwtTokenValidator: Proceeding filter chain for " + request.getRequestURI());

        filterChain.doFilter(request, response);
    }
}