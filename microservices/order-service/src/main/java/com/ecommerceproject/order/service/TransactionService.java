package com.ecommerceproject.order.service;

import com.ecommerceproject.order.modal.Order;
import com.ecommerceproject.order.modal.Transaction;
import java.util.List;

public interface TransactionService {
    Transaction createTransaction(Order order); // Assuming Order has customer/seller IDs

    List<Transaction> getTransactionBySellerId(Long sellerId);

    List<Transaction> getAllTransaction();
}
