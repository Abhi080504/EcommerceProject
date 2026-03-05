package com.ecommerceproject.product.service;

import com.ecommerceproject.product.modal.Home;
import com.ecommerceproject.product.modal.HomeCategory;
import java.util.List;

public interface HomeService {
    Home createHomePageData(List<HomeCategory> allCategories);
}
