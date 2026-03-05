package com.ecommerceproject.product.service.impl;

import com.ecommerceproject.product.domain.HomecategorySection;
import com.ecommerceproject.product.modal.Deals;
import com.ecommerceproject.product.modal.Home;
import com.ecommerceproject.product.modal.HomeCategory;
import com.ecommerceproject.product.repository.DealRepository;
import com.ecommerceproject.product.service.DealService;
import com.ecommerceproject.product.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {
    private final DealRepository dealRepository;
    private final DealService dealService;

    @Override
    public Home createHomePageData(List<HomeCategory> allCategories) {
        List<HomeCategory> gridCategories = allCategories.stream()
                .filter(category -> category.getSection() == HomecategorySection.GRID)
                .collect(Collectors.toList());

        List<HomeCategory> shopByCategories = allCategories.stream()
                .filter(category -> category.getSection() == HomecategorySection.SHOP_BY_CATEGORIES)
                .collect(Collectors.toList());

        List<HomeCategory> electricCategories = allCategories.stream()
                .filter(category -> category.getSection() == HomecategorySection.ELECTRIC_CATEGORIES)
                .collect(Collectors.toList());

        List<HomeCategory> dealCategories = allCategories.stream()
                .filter(category -> category.getSection() == HomecategorySection.DEALS)
                .collect(Collectors.toList());

        List<Deals> createdDeals;

        if (dealService.getDeals().isEmpty()) {
            List<Deals> deals = allCategories.stream()
                    .filter(category -> category.getSection() == HomecategorySection.DEALS)
                    .map(category -> {
                        Deals d = new Deals();
                        d.setCategory(category);
                        d.setDiscount(10);
                        return d;
                    })
                    .collect(Collectors.toList());
            createdDeals = dealRepository.saveAll(deals);
        } else {
            createdDeals = dealService.getDeals();
        }

        Home home = new Home();
        home.setGrid(gridCategories);
        home.setShopByCategories(shopByCategories);
        home.setElectricCategories(electricCategories);
        home.setDealCategories(dealCategories);
        home.setDeals(createdDeals);

        return home;
    }
}
