package com.ecommerceproject.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class AppConfig {

    @org.springframework.beans.factory.annotation.Value("${jwt.secret}")
    private String secret;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            com.ecommerceproject.service.BlacklistService blacklistService,
            org.springframework.data.redis.core.StringRedisTemplate redisTemplate) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers
                        .addHeaderWriter(new org.springframework.security.web.header.writers.StaticHeadersWriter(
                                "Content-Security-Policy",
                                "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:;"))
                        .frameOptions(frame -> frame.deny()))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 🔓 Permit Error and Auth paths
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/home-categories").permitAll() // Permit public access to home categories
                        .requestMatchers("/api/categories").permitAll() // Permit public access to all categories
                        .requestMatchers("/api/deals").permitAll() // Permit public access to deals

                        // 🔓 Permit Seller Public paths
                        .requestMatchers(HttpMethod.POST, "/api/sellers").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/sellers/login").permitAll()
                        .requestMatchers("/api/sellers/verify/**").permitAll()
                        .requestMatchers("/api/sellers/fix-role").permitAll() // TEMPORARY FIX

                        // 🔓 Permit Product Public paths
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                        // 🔒 Role-Specific Routes
                        .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "SUPER")
                        .requestMatchers("/api/home-category/**").hasAnyRole("ADMIN", "SUPER") // Admin manage home
                                                                                               // categories
                        .requestMatchers(HttpMethod.GET, "/api/sellers").hasAnyRole("ADMIN", "SUPER") // Allow
                                                                                                      // Admin/Super to
                                                                                                      // list sellers
                        .requestMatchers("/api/sellers/**").hasRole("SELLER")

                        // 🔒 Secure the rest
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .addFilterBefore(new JwtTokenValidator(blacklistService, secret, redisTemplate),
                        BasicAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration cfg = new CorsConfiguration();
            cfg.setAllowedOrigins(java.util.Arrays.asList(
                    "http://localhost:3000",
                    "http://localhost:3001",
                    "http://localhost:4200"));
            cfg.setAllowedMethods(Collections.singletonList("*"));
            cfg.setAllowedHeaders(Collections.singletonList("*"));
            cfg.setExposedHeaders(Collections.singletonList("Authorization"));
            cfg.setAllowCredentials(true);
            cfg.setMaxAge(3600L);
            return cfg;
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
