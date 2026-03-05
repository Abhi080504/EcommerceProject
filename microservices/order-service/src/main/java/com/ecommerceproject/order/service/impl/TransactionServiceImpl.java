package com.ecommerceproject.order.service.impl;

import com.ecommerceproject.order.modal.Order;
import com.ecommerceproject.order.modal.Transaction;
import com.ecommerceproject.order.repository.TransactionRepository;
import com.ecommerceproject.order.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    @Override
    public Transaction createTransaction(Order order) {
        Transaction transaction = new Transaction();
        transaction.setOrder(order);
        transaction.setCustomerId(order.getUserId());
        transaction.setSellerId(order.getSellerId());
        return transactionRepository.save(transaction);
    }

    @Override
    public List<Transaction> getTransactionBySellerId(Long sellerId) {
        return transactionRepository.findBySellerId(sellerId);
    }

    @Override
    public List<Transaction> getAllTransaction() {
        return transactionRepository.findAll();
    }
}
