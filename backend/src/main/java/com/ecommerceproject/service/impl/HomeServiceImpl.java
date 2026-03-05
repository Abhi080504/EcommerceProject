package com.ecommerceproject.service.impl;

import com.ecommerceproject.domain.HomecategorySection;
import com.ecommerceproject.modal.Deals;
import com.ecommerceproject.modal.Home;
import com.ecommerceproject.modal.HomeCategory;
import com.ecommerceproject.repository.DealRepository;
import com.ecommerceproject.service.DealService;
import com.ecommerceproject.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {
        private final DealRepository dealRepository;
        private final com.ecommerceproject.service.DealService dealService; // Inject Service

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

                List<Deals> createdDeals = new ArrayList<>();

                // Use DealService to fetch deals (Leveraging Cache)
                if (dealService.getDeals().isEmpty()) {
                        List<Deals> deals = allCategories.stream()
                                        .filter(category -> category.getSection() == HomecategorySection.DEALS)
                                        .map(category -> new Deals(null, 10, category))
                                        .collect(Collectors.toList());
                        createdDeals = dealRepository.saveAll(deals);
                } else
                        createdDeals = dealService.getDeals();

                Home home = new Home();
                home.setGrid(gridCategories);
                home.setShopByCategories(shopByCategories);
                home.setElectricCategories(electricCategories);
                home.setDeals(createdDeals);

                return home;
        }
}
