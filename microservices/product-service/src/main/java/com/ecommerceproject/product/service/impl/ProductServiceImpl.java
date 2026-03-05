package com.ecommerceproject.product.service.impl;

import com.ecommerceproject.product.exception.ProductException;
import com.ecommerceproject.product.modal.Category;
import com.ecommerceproject.product.modal.Product;
import com.ecommerceproject.product.repository.CategoryRepository;
import com.ecommerceproject.product.repository.ProductRepository;
import com.ecommerceproject.product.request.CreateProductRequest;
import com.ecommerceproject.product.service.ProductService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@lombok.extern.slf4j.Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    private Category findOrCreateCategory(String categoryId, int level, Category parent) {
        if (categoryId == null || categoryId.isBlank())
            return null;

        List<Category> existingList = categoryRepository.findByCategoryId(categoryId);
        if (existingList != null && !existingList.isEmpty()) {
            return existingList.get(0);
        }

        Category category = new Category();
        category.setCategoryId(categoryId);
        category.setLevel(level);
        category.setParentCategory(parent);

        return categoryRepository.save(category);
    }

    @Override
    @CacheEvict(value = "products_search_v3", allEntries = true)
    public Product createProduct(CreateProductRequest req, Long sellerId) {
        Category level1 = findOrCreateCategory(req.getCategory(), 1, null);
        Category level2 = findOrCreateCategory(req.getCategory2(), 2, level1);
        Category level3 = findOrCreateCategory(req.getCategory3(), 3, level2);

        Category finalCategory = level3 != null ? level3 : level2 != null ? level2 : level1;

        int discountPercentage = calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice());

        Product product = new Product();
        product.setSellerId(sellerId);
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

    private int calculateDiscountPercentage(int mrpPrice, int sellingPrice) {
        if (mrpPrice <= 0)
            throw new IllegalArgumentException("Actual Price must be greater than 0");
        double discount = mrpPrice - sellingPrice;
        return (int) ((discount / mrpPrice) * 100);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "products_v3", key = "#productId"),
            @CacheEvict(value = "products_search_v3", allEntries = true)
    })
    public void deleteProduct(Long productId, Long sellerId) throws ProductException {
        Product product = findProductsById(productId);
        if (!product.getSellerId().equals(sellerId)) {
            throw new ProductException("You are not authorized to delete this product");
        }
        productRepository.delete(product);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "products_v3", key = "#productId"),
            @CacheEvict(value = "products_search_v3", allEntries = true)
    })
    public Product updateProduct(Long productId, Product product, Long sellerId) throws ProductException {
        Product existingProduct = findProductsById(productId);
        if (!existingProduct.getSellerId().equals(sellerId)) {
            throw new ProductException("You are not authorized to update this product");
        }
        product.setId(productId);
        return productRepository.save(product);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "products_v3", key = "#productId"),
            @CacheEvict(value = "products_search_v3", allEntries = true)
    })
    public Product updateProduct(Long productId, CreateProductRequest req, Long sellerId) throws ProductException {
        Product product = findProductsById(productId);
        if (!product.getSellerId().equals(sellerId)) {
            throw new ProductException("You are not authorized to update this product");
        }

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
    @Cacheable(value = "products_v3", key = "#productId")
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

        String tempCategory = category;
        if (category != null) {
            String cleaned = category.trim();
            if (cleaned.startsWith("mens_")) {
                cleaned = cleaned.replaceFirst("mens_", "men_");
            } else if (cleaned.startsWith("womens_")) {
                cleaned = cleaned.replaceFirst("womens_", "women_");
            }

            // Map HomeCategory IDs to actual Product DB Category IDs
            if (cleaned.equalsIgnoreCase("men_jeans")) {
                tempCategory = "men_bottomwear_jeans";
            } else if (cleaned.equalsIgnoreCase("men_kurta")) {
                tempCategory = "men_topwear_kurta";
            } else if (cleaned.equalsIgnoreCase("women_jeans")) {
                tempCategory = "women_bottomwear_jeans";
            } else if (cleaned.equalsIgnoreCase("saree")) {
                tempCategory = "women_ethnic_sarees";
            } else if (cleaned.equalsIgnoreCase("lengha_choli")) {
                tempCategory = "lengha_choli";
            } else if (cleaned.equalsIgnoreCase("women_dress")) {
                tempCategory = "women_dress";
            } else {
                tempCategory = cleaned;
            }
        }
        final String effectiveCategory = tempCategory;
        log.error("DEBUG: getAllProducts called with category: {}", category);
        log.error("DEBUG: effectiveCategory: {}", effectiveCategory);

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
                String searchPattern = rawCategory + "%";

                Predicate isCategory = cb.like(cb.lower(categoryJoin.get("categoryId")), searchPattern);
                Predicate isParent = cb.like(cb.lower(parentJoin.get("categoryId")), searchPattern);
                Predicate isGrandParent = cb.like(cb.lower(grandParentJoin.get("categoryId")), searchPattern);

                // Also search by Name for robustness, but safely
                Predicate isCategoryName = cb.like(cb.lower(categoryJoin.get("name")), searchPattern);

                predicates.add(cb.or(isCategory, isParent, isGrandParent, isCategoryName));
            }

            if (colors != null && !colors.isEmpty())
                predicates.add(cb.equal(root.get("color"), colors));
            if (sizes != null && !sizes.isEmpty())
                predicates.add(cb.equal(root.get("sizes"), sizes));
            if (minPrice != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            if (maxPrice != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            if (minDiscount != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("discountPercent"), minDiscount));

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
    @Caching(evict = {
            @CacheEvict(value = "products_v3", key = "#productId"),
            @CacheEvict(value = "products_search_v3", allEntries = true)
    })
    public Product updateProductRating(Long productId, Double averageRating, Integer numRatings)
            throws ProductException {
        Product product = findProductsById(productId);
        product.setAverageRating(averageRating);
        product.setNumRatings(numRatings);
        return productRepository.save(product);
    }

    @Override
    public Page<Product> getProductBySellerId(Long sellerId, Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, pageSize != null ? pageSize : 10);
        return productRepository.findBySellerId(sellerId, pageable);
    }
}
