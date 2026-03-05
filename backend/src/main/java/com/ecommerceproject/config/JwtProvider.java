package com.ecommerceproject.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JwtProvider {

    private SecretKey key;

    public JwtProvider(@org.springframework.beans.factory.annotation.Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(Authentication auth) {

        // FIX: Correct Type (Collection, NOT Collections)
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

        // FIX: Convert authorities to string
        String roles = populateAuthorities(authorities);

        // FIX: No 'jwt' variable required
        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 864000000)) // 10 days (24*60*60*1000 * 10)
                .claim("email", auth.getName())
                .claim("authorities", roles)
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(Authentication auth) {
        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 604800000L)) // 7 days
                .claim("email", auth.getName())
                .claim("type", "refresh")
                .signWith(key)
                .compact();
    }

    public String getEmailFromJwtToken(String jwt) {

        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }

        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();

        return String.valueOf(claims.get("email"));

    }

    // FIX: Proper implementation (not return null)
    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {

        Set<String> auths = new HashSet<>();

        for (GrantedAuthority auth : authorities) {

            auths.add(auth.getAuthority());

        }

        return String.join(",", auths);

    }
}
