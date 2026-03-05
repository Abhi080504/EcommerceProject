package com.ecommerceproject.service.impl;

import com.ecommerceproject.modal.Deals;
import com.ecommerceproject.modal.HomeCategory;
import com.ecommerceproject.repository.DealRepository;
import com.ecommerceproject.repository.HomeCategoryRepository;
import com.ecommerceproject.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DealServiceImpl implements DealService {
    private final DealRepository dealRepository;
    private final HomeCategoryRepository homeCategoryRepository;

    @Override
    @Cacheable(value = "deals")
    public List<Deals> getDeals() {
        return dealRepository.findAll();
    }

    @Override
    @CacheEvict(value = "deals", allEntries = true)
    public Deals createDeal(Deals deal) {
        HomeCategory category = homeCategoryRepository.findById(deal.getCategory().getId())
                .orElse(null);

        Deals newDeal = dealRepository.save(deal);
        newDeal.setCategory(category);
        newDeal.setDiscount(deal.getDiscount());
        return dealRepository.save(newDeal);
    }

    @Override
    @CacheEvict(value = "deals", allEntries = true)
    public Deals updateDeal(Deals deal, Long id) throws Exception {

        Deals existingDeal = dealRepository.findById(id)
                .orElse(null);

        HomeCategory category = homeCategoryRepository
                .findById(deal.getCategory().getId())
                .orElse(null);

        if (existingDeal != null) {

            if (deal.getDiscount() != null) {
                existingDeal.setDiscount(deal.getDiscount()); // ✅ FIXED
            }

            if (category != null) {
                existingDeal.setCategory(category); // ✅ FIXED
            }

            return dealRepository.save(existingDeal);
        }

        throw new Exception("Deal not found");
    }

    @Override
    @CacheEvict(value = "deals", allEntries = true)
    public void deleteDeal(Long id) throws Exception {
        Deals deal = dealRepository.findById(id).orElseThrow(() -> new Exception("Deal not Found"));
        dealRepository.delete(deal);
    }
}
