package com.ecommerceproject.config;

/**
 * @deprecated Secrets should be loaded from environment variables/properties.
 *             Use @Value("${jwt.secret}") instead.
 */
@Deprecated
public class JWT_CONSTANT {

    // Retained for any legacy compile dependencies, but runtime should use
    // properties.
    public static final String SECRET_KEY = "deprecated_hardcoded_key_do_not_use";
    public static final String JWT_HEADER = "Authorization";

}
