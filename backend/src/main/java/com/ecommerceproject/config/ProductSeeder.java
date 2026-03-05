package com.ecommerceproject.config;

import com.ecommerceproject.domain.AccountStatus;
import com.ecommerceproject.domain.HomecategorySection;
import com.ecommerceproject.modal.Category;
import com.ecommerceproject.modal.HomeCategory;
import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.repository.CategoryRepository;
import com.ecommerceproject.repository.HomeCategoryRepository;
import com.ecommerceproject.repository.ProductRepository;
import com.ecommerceproject.repository.SellerRepository;
import com.ecommerceproject.repository.DealRepository;
import com.ecommerceproject.modal.Deals;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final CategoryRepository categoryRepository;
    private final HomeCategoryRepository homeCategoryRepository;
    private final DealRepository dealRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        boolean productsExist = productRepository.count() > 0;
        boolean homeCategoriesExist = homeCategoryRepository.count() > 0;
        boolean dealsExist = dealRepository.count() > 0;

        if (productsExist && homeCategoriesExist && dealsExist) {
            System.out.println("SEEDER: Data already exists. Skipping seeding.");
            return;
        }

        System.out.println("SEEDER: Starting data seeding...");

        Seller seller = null;
        if (!productsExist) {
            System.out.println("SEEDER: Seeding Products...");
            // 1. Create a Dummy Seller
            seller = sellerRepository.findByEmail("seller@brand.com");
            if (seller == null) {
                seller = new Seller();
                seller.setEmail("seller@brand.com");
                seller.setPassword(passwordEncoder.encode("seller123"));
                seller.setSellerName("Fashion Brand");
                seller.setMobile("9876543210");
                seller.setAccountStatus(AccountStatus.ACTIVE);
                seller = sellerRepository.save(seller);
            }
        }

        // 2. Define Categories and Products
        seedData(seller, "men_jeans", "Men", "Clothing", "Men's Jeans",
                "https://rukminim2.flixcart.com/image/612/612/xif0q/jean/y/r/w/32-fmjn3458-flying-machine-original-imagnq5w8ygzgw9u.jpeg?q=70",
                "Flying Machine", "Men Slim Mid Rise Blue Jeans", 1299, 2599, productsExist);

        seedData(seller, "mens_kurta", "Men", "Clothing", "Men's Kurta",
                "https://rukminim2.flixcart.com/image/612/612/xif0q/kurta/j/a/r/l-kast109us-majestic-man-original-imafw49u5uty4agx-bb.jpeg?q=70",
                "Majestic Man", "Men Solid Pure Cotton Straight Kurta", 499, 1499, productsExist);

        seedData(seller, "saree", "Women", "Clothing", "Saree",
                "https://rukminim2.flixcart.com/image/612/612/xif0q/saree/s/u/t/free-saree-k-s-creation-unstitched-original-imagp7v66n54a6ta.jpeg?q=70",
                "K S Creation", "Self Design Bollywood Net Saree", 399, 1999, productsExist);

        seedData(seller, "women_lehenga", "Women", "Clothing", "Lehenga Choli",
                "https://rukminim2.flixcart.com/image/612/612/xif0q/lehenga-choli/y/p/b/free-sleeveless-foster-black-lehenga-choli-divastri-original-imagg9k7g8g8g8g8.jpeg?q=70",
                "Divastri", "Self Design Semi Stitched Lehenga Choli", 899, 3999, productsExist);

        // --- ADDITIONAL CATEGORIES FOR DROPDOWN ---
        // Men
        seedCategory("men_shirt", "Men", "Clothing", "Men's Shirt");
        seedCategory("men_tshirt", "Men", "Clothing", "Men's T-Shirt");
        seedCategory("men_footwear", "Men", "Footwear", "Men's Shoes");

        // Women
        seedCategory("women_top", "Women", "Clothing", "Women's Tops");
        seedCategory("women_footwear", "Women", "Footwear", "Women's Shoes");

        // Electronics
        seedCategory("mobiles", "Electronics", "Mobiles", "Mobile Phones");
        seedCategory("laptops", "Electronics", "Laptops", "Laptops");
        seedCategory("headphones", "Electronics", "Audio", "Headphones");

        // Grocery
        seedCategory("grocery_dairy_milk", "Groceries", "Dairy", "Milk");
        seedCategory("grocery_dairy_cheese", "Groceries", "Dairy", "Cheese");
        seedCategory("grocery_veg_tomato", "Groceries", "Vegetables", "Tomato");
        seedCategory("grocery_veg_potato", "Groceries", "Vegetables", "Potato");

        System.out.println("SEEDER: Data seeding completed!");
    }

    private void seedData(Seller seller, String categoryId, String topLevel, String parentName, String catName,
            String imageUrl, String brand, String title, int sellingPrice, int mrpPrice, boolean productsExist) {

        // 1. Seed Categories (Ensure Hierarchy Exists)
        java.util.List<Category> topCats = categoryRepository.findByCategoryId(topLevel.toLowerCase());
        Category topCat = topCats.isEmpty() ? null : topCats.get(0);
        if (topCat == null) {
            topCat = new Category();
            topCat.setCategoryId(topLevel.toLowerCase());
            topCat.setName(topLevel);
            topCat.setLevel(1);
            topCat = categoryRepository.save(topCat);
        }

        Category parentCat = categoryRepository.findByCategoryIdAndParentCategory(parentName.toLowerCase(), topCat);
        if (parentCat == null) {
            parentCat = new Category();
            parentCat.setCategoryId(parentName.toLowerCase());
            parentCat.setName(parentName);
            parentCat.setParentCategory(topCat);
            parentCat.setLevel(2);
            parentCat = categoryRepository.save(parentCat);
        }

        Category category = categoryRepository.findByCategoryIdAndParentCategory(categoryId, parentCat);
        if (category == null) {
            category = new Category();
            category.setCategoryId(categoryId);
            category.setName(catName);
            category.setParentCategory(parentCat);
            category.setLevel(3);
            category = categoryRepository.save(category);
        }

        // 2. Seed Home Category
        HomeCategory homeCategory = homeCategoryRepository.findByCategoryId(categoryId);
        if (homeCategory == null) {
            homeCategory = new HomeCategory();
            homeCategory.setCategoryId(categoryId);
            homeCategory.setName(catName);
            homeCategory.setImage(imageUrl);
            homeCategory.setSection(HomecategorySection.SHOP_BY_CATEGORIES);
            homeCategory = homeCategoryRepository.save(homeCategory);
            System.out.println("SEEDER: Added HomeCategory: " + catName);
        }

        // 3. Seed Deals
        if (dealRepository.findByCategory(homeCategory).isEmpty()) {
            Deals deal = new Deals();
            deal.setCategory(homeCategory);
            deal.setDiscount((int) (Math.random() * 50) + 10);
            dealRepository.save(deal);
            System.out.println("SEEDER: Added Deal for: " + catName);
        }

        // 3. Seed Products (only if not already existing)
        if (!productsExist && seller != null) {
            for (int i = 1; i <= 5; i++) {
                Product product = new Product();
                product.setTitle(title + " " + i);
                product.setDescription("High quality " + catName + " from " + brand);
                product.setMrpPrice(mrpPrice);
                product.setSellingPrice(sellingPrice);
                product.setDiscountPercent((int) (((double) (mrpPrice - sellingPrice) / mrpPrice) * 100));
                product.setQuantity(50);
                product.setColor("Multicolor");
                product.setImages(List.of(imageUrl));
                product.setNumRatings(0);
                product.setCategory(category);
                product.setSeller(seller);
                product.setCreatedAt(LocalDateTime.now());
                product.setSizes("S,M,L,XL");

                productRepository.save(product);
            }
        }
    }

    private void seedCategory(String categoryId, String topLevel, String parentName, String catName) {
        java.util.List<Category> topCats = categoryRepository.findByCategoryId(topLevel.toLowerCase());
        Category topCat = topCats.isEmpty() ? null : topCats.get(0);
        if (topCat == null) {
            topCat = new Category();
            topCat.setCategoryId(topLevel.toLowerCase());
            topCat.setName(topLevel);
            topCat.setLevel(1);
            topCat = categoryRepository.save(topCat);
        }

        Category parentCat = categoryRepository.findByCategoryIdAndParentCategory(parentName.toLowerCase(), topCat);
        if (parentCat == null) {
            parentCat = new Category();
            parentCat.setCategoryId(parentName.toLowerCase());
            parentCat.setName(parentName);
            parentCat.setParentCategory(topCat);
            parentCat.setLevel(2);
            parentCat = categoryRepository.save(parentCat);
        }

        Category category = categoryRepository.findByCategoryIdAndParentCategory(categoryId, parentCat);
        if (category == null) {
            category = new Category();
            category.setCategoryId(categoryId);
            category.setName(catName);
            category.setParentCategory(parentCat);
            category.setLevel(3);
            category = categoryRepository.save(category);
            System.out.println("SEEDER: Added Category: " + catName);
        }
    }
}
