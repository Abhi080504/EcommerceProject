package com.ecommerceproject.service;

import com.ecommerceproject.modal.Home;
import com.ecommerceproject.modal.HomeCategory;

import java.util.List;

public interface HomeService {

    public Home createHomePageData(List<HomeCategory> allCategories);

}
