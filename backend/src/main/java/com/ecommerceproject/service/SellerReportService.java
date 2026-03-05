package com.ecommerceproject.service;

import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.modal.SellerReport;

public interface SellerReportService {
    SellerReport getSellerReport(Seller seller);
    SellerReport updateSellerReport(SellerReport sellerReport);
}
