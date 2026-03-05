package com.ecommerceproject.service;

import com.ecommerceproject.modal.Deals;

import java.util.List;

public interface DealService {
    List<Deals> getDeals();
    Deals createDeal(Deals deal);
    Deals updateDeal(Deals deal,Long id) throws Exception;
    void deleteDeal(Long id) throws Exception;
}
