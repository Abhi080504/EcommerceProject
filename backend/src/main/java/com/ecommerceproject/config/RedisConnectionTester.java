package com.ecommerceproject.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisConnectionTester implements CommandLineRunner {

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            redisTemplate.opsForValue().set("test-key", "Hello Redis");
            String value = (String) redisTemplate.opsForValue().get("test-key");
            System.out.println("✅ REDIS CONNECTION SUCCESSFUL: Retrieved value '" + value + "'");
        } catch (Exception e) {
            System.err.println("❌ REDIS CONNECTION FAILED: " + e.getMessage());
        }
    }
}
