package com.ecommerceproject.service.impl;

import com.ecommerceproject.exceptions.ProductException;
import com.ecommerceproject.modal.Category;
import com.ecommerceproject.modal.Product;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.repository.CategoryRepository;
import com.ecommerceproject.repository.ProductRepository;
import com.ecommerceproject.request.createProductRequest;
import com.ecommerceproject.service.ProductService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /*
     * ==============================
     * HELPER — Reuse or Create Category
     * ==============================
     */
    private Category findOrCreateCategory(
            String categoryId,
            int level,
            Category parent) {
        if (categoryId == null || categoryId.isBlank())
            return null;

        // Check by ID first (since it's unique-ish but might have duplicates due to
        // bug)
        // Returns List now
        java.util.List<Category> existingList = categoryRepository.findByCategoryId(categoryId);

        if (existingList != null && !existingList.isEmpty()) {
            // Just take the first one found to avoid crash
            return existingList.get(0);
        }

        Category category = new Category();
        category.setCategoryId(categoryId);
        category.setLevel(level);
        category.setParentCategory(parent);

        return categoryRepository.save(category);
    }

    /*
     * ==============================
     * CREATE PRODUCT
     * ==============================
     */
    @Override
    @CacheEvict(value = "products_search", allEntries = true)
    public Product createProduct(createProductRequest req, Seller seller) {

        // ---------- CATEGORY LEVEL 1 ----------
        Category level1 = findOrCreateCategory(
                req.getCategory(),
                1,
                null);

        // ---------- CATEGORY LEVEL 2 ----------
        Category level2 = findOrCreateCategory(
                req.getCategory2(),
                2,
                level1);

        // ---------- CATEGORY LEVEL 3 ----------
        Category level3 = findOrCreateCategory(
                req.getCategory3(),
                3,
                level2);

        // attach product to deepest valid level
        Category finalCategory = level3 != null ? level3 : level2 != null ? level2 : level1;

        int discountPercentage = calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice());

        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(finalCategory);
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setCreatedAt(LocalDateTime.now());
        product.setColor(req.getColor());
        product.setSellingPrice(req.getSellingPrice());
        product.setImages(req.getImages());
        product.setMrpPrice(req.getMrpPrice());
        product.setSizes(req.getSizes());
        product.setDiscountPercent(discountPercentage);
        product.setQuantity(req.getQuantity());
        product.setBrand(req.getBrand());
        product.setBrandDescription(req.getBrandDescription());

        return productRepository.save(product);
    }

    /*
     * ==============================
     * DISCOUNT CALCULATION
     * ==============================
     */
    private int calculateDiscountPercentage(int mrpPrice, int sellingPrice) {

        if (mrpPrice <= 0) {
            throw new IllegalArgumentException("Actual Price must be greater than 0");
        }

        double discount = mrpPrice - sellingPrice;
        double discountPercentage = (discount / mrpPrice) * 100;

        return (int) discountPercentage;
    }

    /*
     * ==============================
     * CRUD + FILTERS (Existing Code)
     * ==============================
     */
    @Override
    @Caching(evict = {
            @CacheEvict(value = "products", key = "#productId"),
            @CacheEvict(value = "products_search", allEntries = true)
    })
    public void deleteProduct(Long productId) throws ProductException {
        Product product = findProductsById(productId);
        productRepository.delete(product);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "products", key = "#productId"),
            @CacheEvict(value = "products_search", allEntries = true)
    })
    public Product updateProduct(Long productId, Product product) throws ProductException {
        findProductsById(productId);
        product.setId(productId);
        return productRepository.save(product);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "products", key = "#productId"),
            @CacheEvict(value = "products_search", allEntries = true)
    })
    public Product updateProduct(Long productId, createProductRequest req) throws ProductException {
        Product product = findProductsById(productId);

        // Update Category Logic (Reused from Create)
        Category level1 = findOrCreateCategory(req.getCategory(), 1, null);
        Category level2 = findOrCreateCategory(req.getCategory2(), 2, level1);
        Category level3 = findOrCreateCategory(req.getCategory3(), 3, level2);
        Category finalCategory = level3 != null ? level3 : level2 != null ? level2 : level1;

        int discountPercentage = calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice());

        product.setCategory(finalCategory);
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setColor(req.getColor());
        product.setSellingPrice(req.getSellingPrice());
        product.setImages(req.getImages());
        product.setMrpPrice(req.getMrpPrice());
        product.setSizes(req.getSizes());
        product.setDiscountPercent(discountPercentage);
        product.setQuantity(req.getQuantity());
        product.setBrand(req.getBrand());
        product.setBrandDescription(req.getBrandDescription());

        return productRepository.save(product);
    }

    @Override
    @Cacheable(value = "products", key = "#productId")
    public Product findProductsById(Long productId) throws ProductException {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found with id " + productId));
    }

    @Override
    public Page<Product> searchProducts(String query, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, pageSize != null ? pageSize : 10);
        return productRepository.searchProduct(query, pageable);
    }

    @Override
    @Cacheable(value = "products_search")
    public Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            String sizes,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            String stock,
            Integer pageNumber,
            Integer pageSize) {

        // Fix legacy category keys
        // Fix legacy category keys
        String tempCategory = category;
        if (category != null) {
            if (category.equals("mens_kurta"))
                tempCategory = "men_kurta";
            else if (category.equals("saree"))
                tempCategory = "women_sarees";
        }
        final String effectiveCategory = tempCategory;

        Specification<Product> spec = (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (effectiveCategory != null) {
                Join<Product, Category> categoryJoin = root.join("category",
                        jakarta.persistence.criteria.JoinType.LEFT);
                Join<Category, Category> parentJoin = categoryJoin.join("parentCategory",
                        jakarta.persistence.criteria.JoinType.LEFT);
                Join<Category, Category> grandParentJoin = parentJoin.join("parentCategory",
                        jakarta.persistence.criteria.JoinType.LEFT);

                String rawCategory = effectiveCategory.toLowerCase();
                // Check if it's a compound category like "men_jeans"
                if (rawCategory.contains("_")) {
                    String[] keywords = rawCategory.split("_");
                    List<Predicate> keywordPredicates = new ArrayList<>();

                    for (String keyword : keywords) {
                        // For each keyword, it must appear in EITHER category, parent, OR grandparent
                        Predicate inCategory = cb.like(cb.lower(categoryJoin.get("categoryId")), "%" + keyword + "%");
                        Predicate inParent = cb.like(cb.lower(parentJoin.get("categoryId")), "%" + keyword + "%");
                        Predicate inGrandParent = cb.like(cb.lower(grandParentJoin.get("categoryId")),
                                "%" + keyword + "%");

                        // Also check Name for better user friendliness
                        Predicate inCategoryName = cb.like(cb.lower(categoryJoin.get("name")), "%" + keyword + "%");

                        keywordPredicates.add(cb.or(inCategory, inParent, inGrandParent, inCategoryName));
                    }
                    // All keywords must be satisfied (AND)
                    predicates.add(cb.and(keywordPredicates.toArray(new Predicate[0])));
                } else {
                    // Fallback to simpler strict + flexible match for single keyword
                    Predicate isCategory = cb.equal(cb.lower(categoryJoin.get("categoryId")), rawCategory);
                    Predicate isParent = cb.equal(cb.lower(parentJoin.get("categoryId")), rawCategory);
                    Predicate isGrandParent = cb.equal(cb.lower(grandParentJoin.get("categoryId")), rawCategory);

                    predicates.add(cb.or(isCategory, isParent, isGrandParent));
                }
            }

            if (colors != null && !colors.isEmpty()) {
                predicates.add(cb.equal(root.get("color"), colors));
            }

            if (sizes != null && !sizes.isEmpty()) {
                predicates.add(cb.equal(root.get("sizes"), sizes));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }

            if (minDiscount != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("discountPercent"), minDiscount));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable;
        int size = pageSize != null ? pageSize : 10;
        int page = pageNumber != null ? pageNumber : 0;

        if (sort != null && !sort.isEmpty()) {

            switch (sort) {

                case "price_low":
                    pageable = PageRequest.of(page, size, Sort.by("sellingPrice").ascending());
                    break;

                case "price_high":
                    pageable = PageRequest.of(page, size, Sort.by("sellingPrice").descending());
                    break;

                case "newest":
                    pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
                    break;

                default:
                    pageable = PageRequest.of(page, size, Sort.unsorted());
                    break;
            }
        } else {
            pageable = PageRequest.of(page, size, Sort.unsorted());
        }

        return productRepository.findAll(spec, pageable);
    }

    @Override
    public Page<Product> getProductBySellerId(Long sellerId, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, pageSize != null ? pageSize : 10);
        return productRepository.findBySellerId(sellerId, pageable);
    }
}
