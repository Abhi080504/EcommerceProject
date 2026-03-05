package com.ecommerceproject.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class BlacklistService {

    private final RedisTemplate<String, Object> redisTemplate;

    // Default blacklist duration matches JWT expiry (e.g., 24 hours)
    private static final long DEFAULT_TTL_HOURS = 24;

    public void blacklistToken(String token) {
        if (token == null)
            return;
        // Store token in Redis with expiry
        redisTemplate.opsForValue().set("blacklist:" + token, "true", DEFAULT_TTL_HOURS, TimeUnit.HOURS);
    }

    public boolean isBlacklisted(String token) {
        if (token == null)
            return false;
        return Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + token));
    }
}
