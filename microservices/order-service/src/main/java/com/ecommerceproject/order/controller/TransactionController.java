package com.ecommerceproject.order.controller;

import com.ecommerceproject.order.modal.Order;
import com.ecommerceproject.order.modal.Transaction;
import com.ecommerceproject.order.response.ApiResponse;
import com.ecommerceproject.order.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.ecommerceproject.order.feign.AuthFeignClient;
import com.ecommerceproject.order.modal.SellerDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final AuthFeignClient authFeignClient;

    @PostMapping
    public ResponseEntity<ApiResponse<Transaction>> createTransaction(@RequestBody Order order) {
        try {
            Transaction transaction = transactionService.createTransaction(order);
            ApiResponse<Transaction> response = new ApiResponse<>(true, "Transaction Created", transaction,
                    HttpStatus.CREATED.value());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            ApiResponse<Transaction> response = new ApiResponse<>(false, e.getMessage(), null,
                    HttpStatus.INTERNAL_SERVER_ERROR.value());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/seller")
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactionBySellerId(
            @RequestHeader("Authorization") String jwt) throws Exception {

        SellerDTO seller = authFeignClient.getSellerProfile(jwt).getData();
        if (seller == null) {
            throw new Exception("Seller invalid or not found");
        }

        List<Transaction> transactions = transactionService.getTransactionBySellerId(seller.getId());
        return ResponseEntity
                .ok(new ApiResponse<>(true, "Transactions Retrieved", transactions, HttpStatus.OK.value()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Transaction>>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransaction();
        ApiResponse<List<Transaction>> response = new ApiResponse<>(true, "All Transactions Retrieved", transactions,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }
}
