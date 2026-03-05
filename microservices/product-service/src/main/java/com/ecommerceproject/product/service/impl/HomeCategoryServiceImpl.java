package com.ecommerceproject.product.service.impl;

import com.ecommerceproject.product.modal.HomeCategory;
import com.ecommerceproject.product.repository.HomeCategoryRepository;
import com.ecommerceproject.product.service.HomeCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeCategoryServiceImpl implements HomeCategoryService {
    private final HomeCategoryRepository homeCategoryRepository;

    @Override
    @CacheEvict(value = "homeCategories", allEntries = true)
    public HomeCategory createHomeCategory(HomeCategory homeCategory) {
        return homeCategoryRepository.save(homeCategory);
    }

    @Override
    @CacheEvict(value = "homeCategories", allEntries = true)
    public List<HomeCategory> createCategories(List<HomeCategory> homeCategories) {
        if (homeCategoryRepository.findAll().isEmpty()) {
            return homeCategoryRepository.saveAll(homeCategories);
        }
        return homeCategoryRepository.findAll();
    }

    @Override
    @CacheEvict(value = "homeCategories", allEntries = true)
    public HomeCategory updateHomeCategory(HomeCategory homeCategory, Long id) throws Exception {
        HomeCategory existingCategory = homeCategoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Category not found"));

        if (homeCategory.getImage() != null && !homeCategory.getImage().isEmpty()) {
            existingCategory.setImage(homeCategory.getImage());
        }
        if (homeCategory.getCategoryId() != null) {
            existingCategory.setCategoryId(homeCategory.getCategoryId());
        }
        return homeCategoryRepository.save(existingCategory);
    }

    @Override
    @Cacheable(value = "homeCategories")
    public List<HomeCategory> getAllHomeCategories() {
        return homeCategoryRepository.findAll();
    }
}
