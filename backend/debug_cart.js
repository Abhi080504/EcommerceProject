const axios = require('axios');

const API_URL = 'http://localhost:8080/api';
const AUTH_URL = 'http://localhost:8080/api/auth';

// Use a known email if possible, or new one. 
// A new user might have an empty cart, which is a good test case for NPEs.
const EMAIL = "debug_cart_" + Date.now() + "@example.com";
const ROLE = "ROLE_CUSTOMER";

async function debugCart() {
    try {
        console.log(`\n=== DEBUGGING CART 500 ERROR ===`);

        // 1. Send OTP (Mocked to 123456)
        try {
            await axios.post(`${AUTH_URL}/send/login-signup-otp`, { email: EMAIL, role: ROLE });
        } catch (e) { /* ignore */ }

        // 2. Signup/Login
        let jwt = "";
        try {
            const res = await axios.post(`${AUTH_URL}/signup`, {
                email: EMAIL, fullName: "Debug User", mobile: "1234567890", otp: "123456", role: ROLE
            });
            jwt = res.data.jwt;
        } catch (e) {
            const res = await axios.post(`${AUTH_URL}/signing`, { email: EMAIL, otp: "123456" });
            jwt = res.data.jwt;
        }

        console.log("✅ Authenticated. Token received.");

        // 3. Call Cart Endpoint
        console.log("3. Calling GET /api/cart...");
        await axios.get(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });

        console.log("✅ Cart call SUCCESS (No 500 Error for fresh user).");

    } catch (error) {
        if (error.response) {
            console.error("❌ BACKEND ERROR RESPONSE:");
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("❌ Request Error:", error.message);
        }
    }
}

debugCart();
