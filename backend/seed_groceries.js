const https = require('http'); // Using http instead of https for localhost
const crypto = require('crypto');

// --- CONFIG ---
const API_BASE = 'http://localhost:8080/api';
const SECRET_KEY = 'thisismysecretkeythisismyprivatekey';
const SELLER_EMAIL = 'seed_seller@grocery.com';

// --- DATA ---
const products = [
    {
        title: "Amul Gold Full Cream Fresh Milk",
        description: "Pasteurized full cream milk",
        mrpPrice: 200,
        sellingPrice: 169,
        quantity: 100,
        color: "White",
        images: ["https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/3a8d4113-939d-4e4e-a7ce-96e52152ba97/Amul-Gold-Full-Cream-Fresh-Milk-Pouch-.jpeg"],
        category: "groceries",
        category2: "dairy",
        category3: "milk",
        sizes: "1 L"
    },
    {
        title: "Fresh Spinach (Palak) Bunch",
        description: "Freshly picked spinach leaves",
        mrpPrice: 60,
        sellingPrice: 40,
        quantity: 50,
        color: "Green",
        images: ["https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3000-3000,pr-true,f-auto,q-40,dpr-2/cms/product_variant/9455f38c-adc5-4f92-a09f-b3a16d52d84b/Spring-Onion.jpeg"],
        category: "groceries",
        category2: "vegetables",
        category3: "leafy",
        sizes: "250 g"
    },
    {
        title: "Mahabaleshwar Strawberries",
        description: "Sweet and tangy fresh strawberries",
        mrpPrice: 150,
        sellingPrice: 120,
        quantity: 30,
        color: "Red",
        images: ["https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1024-1024,pr-true,f-auto,q-40,dpr-2/cms/product_variant/5168c567-2dc1-4459-b5e0-522786d318a8/Strawberry-Mahabaleshwar-.png"],
        category: "groceries",
        category2: "fruits",
        category3: "berries",
        sizes: "200 g"
    },
    {
        title: "Tata Sampann Toor Dal",
        description: "High protein unpolished dal",
        mrpPrice: 180,
        sellingPrice: 145,
        quantity: 100,
        color: "Yellow",
        images: ["https://www.jiomart.com/images/product/original/491696131/good-life-toor-dal-1-kg-product-images-o491696131-p590033488-0-202203150243.jpg"],
        category: "groceries",
        category2: "pulses",
        category3: "dal",
        sizes: "1 kg"
    },
    {
        title: "Farm Fresh Organic Eggs",
        description: "Free range organic eggs",
        mrpPrice: 110,
        sellingPrice: 89,
        quantity: 100,
        color: "White",
        images: ["https://cdn.dribbble.com/userupload/21725903/file/original-9f55c5d0c8c2711429194a80f6f827ca.jpg?format=webp&resize=640x480&vertical=center"],
        category: "groceries",
        category2: "dairy",
        category3: "eggs",
        sizes: "6 pcs"
    },
    {
        title: "Red Onion (Nashik)",
        description: "Premium quality onions",
        mrpPrice: 50,
        sellingPrice: 35,
        quantity: 200,
        color: "Red",
        images: ["https://cdn.zeptonow.com/production/tr:w-403,ar-1024-1024,pr-true,f-auto,q-40,dpr-2/cms/product_variant/1e55d6e9-6958-40d3-ac15-1b63fc49e248.jpeg"],
        category: "groceries",
        category2: "vegetables",
        category3: "onion",
        sizes: "1 kg"
    },
    {
        title: "Fortune Sunlite Refined Oil",
        description: "Healthy cooking oil",
        mrpPrice: 160,
        sellingPrice: 135,
        quantity: 80,
        color: "Yellow",
        images: ["https://cdn.dribbble.com/userupload/14584754/file/original-c88a478ac44004d683e312db118165b1.png?format=webp&resize=640x480&vertical=center"],
        category: "groceries",
        category2: "organic",
        category3: "oil",
        sizes: "1 L"
    },
    {
        title: "Whole Wheat Atta",
        description: "100% whole wheat flour",
        mrpPrice: 60,
        sellingPrice: 45,
        quantity: 150,
        color: "Brown",
        images: ["https://media.istockphoto.com/id/659524906/photo/composition-with-variety-of-vegetarian-food-ingredients.jpg?s=612x612&w=0&k=20&c=AzFdpJXWAVArpzTxJxhUqCENYcYb2ozltPhYaYJAkFQ="],
        category: "groceries",
        category2: "pulses", // Mapping to pulses as per original mock data logic, or could be 'staples'
        category3: "flour",
        sizes: "1 kg"
    }
];

// --- JWT HELPER ---
function signJwt(email) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        email: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365) // 1 year
    };

    const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const b64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureInput = `${b64Header}.${b64Payload}`;

    // Create signature using built-in crypto
    // NOTE: Spring Boot uses Keys.hmacShaKeyFor(secret.getBytes()) which treats secret as raw bytes.
    // However, jjwt usually defaults to UTF-8. 
    // We will use standard HMAC SHA256.
    const signature = crypto.createHmac('sha256', SECRET_KEY)
        .update(signatureInput)
        .digest('base64url');

    return `${signatureInput}.${signature}`;
}

// --- HTTP HELPER ---
function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data); // In case of non-json response
                    }
                } else {
                    reject({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

// --- MAIN ---
async function main() {
    console.log("🚀 Starting Seeding Script...");

    // 1. Create Seller
    console.log("creating Seller...");
    const sellerData = {
        sellerName: "Groceries Instant Seller",
        email: SELLER_EMAIL,
        password: "password123",
        mobile: "9876543210",
        GSTIN: "29AAAAA0000A1Z5",
        pickUpAddress: {
            name: "Warehouse",
            mobile: "9876543210",
            pincode: "123456",
            address: "123 Green Street",
            locality: "Green Valley",
            city: "Mumbai",
            state: "Maharashtra"
        },
        bankDetails: {
            accountNumber: "1234567890",
            accountHolderName: "Grocery Seller",
            ifscCode: "HDFC0001234"
        }
    };

    try {
        await request('POST', '/sellers', sellerData);
        console.log("✅ Seller Created (or already exists).");
    } catch (e) {
        console.log("ℹ️ Seller creation note (likely exists):", e.data || e);
        // Continue anyway, as we can auth if it exists
    }

    // 2. Mint Token
    console.log("🔑 Minting Token...");
    const token = signJwt(SELLER_EMAIL);
    console.log("✅ Token Minted.");

    // 3. Create Products
    console.log(`📦 Seeding ${products.length} Products...`);

    for (const p of products) {
        try {
            await request('POST', '/sellers/products', p, token);
            console.log(`   ✅ Added: ${p.title}`);
        } catch (e) {
            console.error(`   ❌ Failed: ${p.title}`, e.data || e);
        }
    }

    console.log("🎉 Seeding Completed!");
}

main();
