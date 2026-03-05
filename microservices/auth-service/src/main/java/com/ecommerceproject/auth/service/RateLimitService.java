package com.ecommerceproject.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RateLimitService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_DURATION_MINUTES = 15;
    private static final long ATTEMPT_TTL_MINUTES = 60;

    public boolean isBlocked(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey("rate_limit_blocked:" + key));
    }

    public void recordAttempt(String key) {
        String attemptsKey = "rate_limit_attempts:" + key;
        String blockedKey = "rate_limit_blocked:" + key;

        if (isBlocked(key)) {
            return;
        }

        Long attempts = redisTemplate.opsForValue().increment(attemptsKey);

        if (attempts != null && attempts == 1) {
            redisTemplate.expire(attemptsKey, ATTEMPT_TTL_MINUTES, TimeUnit.MINUTES);
        }

        if (attempts != null && attempts >= MAX_ATTEMPTS) {
            redisTemplate.opsForValue().set(blockedKey, "true", LOCK_DURATION_MINUTES, TimeUnit.MINUTES);
            redisTemplate.delete(attemptsKey);
        }
    }

    public void resetAttempts(String key) {
        redisTemplate.delete("rate_limit_attempts:" + key);
        redisTemplate.delete("rate_limit_blocked:" + key);
    }
}
