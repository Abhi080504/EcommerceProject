package com.ecommerceproject.gateway.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;

@Component
public class AuthenticationFilter implements GlobalFilter {

    @Value("${jwt.secret}")
    private String secret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String path = exchange.getRequest().getURI().getPath();

        System.out.println("GATEWAY: [FILTER] Request Path: " + path);
        System.out.println("GATEWAY: [FILTER] Auth Header Present: " + (authHeader != null));

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String email = String.valueOf(claims.get("email"));
                Object idObj = claims.get("id");
                Object authoritiesObj = claims.get("authorities");
                String authorities = authoritiesObj != null ? String.valueOf(authoritiesObj) : "";

                System.out.println("GATEWAY-DEBUG: [AUTH] Path: " + path);
                System.out.println("GATEWAY-DEBUG: [AUTH] Email: " + email);
                System.out.println("GATEWAY-DEBUG: [AUTH] Roles: " + authorities);
                System.out.println("GATEWAY-DEBUG: [AUTH] ID: " + idObj);

                ServerHttpRequest.Builder requestBuilder = exchange.getRequest().mutate()
                        .header("X-User-Email", email)
                        .header("X-User-Roles", authorities);

                if (idObj != null) {
                    String id = String.valueOf(idObj);

                    // Distinguish between User and Seller IDs to prevent service-level collisions
                    if (authorities.contains("ROLE_SELLER")) {
                        System.out.println(
                                "GATEWAY-DEBUG: [AUTH-SUCCESS] Injecting X-Seller-Id: " + id + " for path: " + path);
                        requestBuilder.header("X-Seller-Id", id);
                    } else {
                        // ROLE_CUSTOMER, ROLE_ADMIN, ROLE_SUPER
                        System.out.println(
                                "GATEWAY-DEBUG: [AUTH-SUCCESS] Injecting X-User-Id: " + id + " for path: " + path);
                        requestBuilder.header("X-User-Id", id);
                    }
                } else {
                    System.out.println("GATEWAY-DEBUG: [AUTH-WARNING] ID claim is MISSING for path: " + path);
                }

                ServerHttpRequest request = requestBuilder.build();
                return chain.filter(exchange.mutate().request(request).build());
            } catch (Exception e) {
                System.err.println(
                        "GATEWAY-DEBUG: [AUTH-ERROR] Path: " + path + " - Token Validation Failed: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("GATEWAY-DEBUG: [AUTH-SKIP] No valid Bearer token for path: " + path);
        }

        return chain.filter(exchange);
    }
}
