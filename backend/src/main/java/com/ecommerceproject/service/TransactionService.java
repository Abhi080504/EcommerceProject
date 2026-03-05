package com.ecommerceproject.service;

import com.ecommerceproject.modal.Order;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.modal.Transaction;

import java.util.List;

public interface TransactionService {

    Transaction createTransaction(Order order) throws Exception;
    List<Transaction> getTransactionBySellerId(Seller seller);
    List<Transaction> getAllTransaction();
}
