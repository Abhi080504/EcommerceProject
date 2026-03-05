package com.ecommerceproject.auth.util;

import java.util.Random;

public class OtpUtil {

    public static String generateOtp() {
        int otp = new Random().nextInt(1000000);
        return String.format("%06d", otp);
    }
}
