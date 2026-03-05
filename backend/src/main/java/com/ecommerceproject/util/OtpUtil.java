package com.ecommerceproject.util;

import java.util.Random;

public class OtpUtil {

    public static String generateOtp() {
        int otp = new Random().nextInt(999999);
        return String.format("%06d", otp);
    }
}
