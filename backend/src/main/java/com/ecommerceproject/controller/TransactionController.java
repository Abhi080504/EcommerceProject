package com.ecommerceproject.controller;

import com.ecommerceproject.modal.Order;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.modal.Transaction;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.service.SellerService;
import com.ecommerceproject.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final SellerService sellerService;

    @PostMapping
    public ResponseEntity<ApiResponse<Transaction>> createTransaction(@Valid @RequestBody Order order) {
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

        Seller seller = sellerService.getSellerProfile(jwt);

        List<Transaction> transactions = transactionService.getTransactionBySellerId(seller);

        ApiResponse<List<Transaction>> response = new ApiResponse<>(true, "Transactions Retrieved", transactions,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Transaction>>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransaction();

        ApiResponse<List<Transaction>> response = new ApiResponse<>(true, "All Transactions Retrieved", transactions,
                HttpStatus.OK.value());
        return ResponseEntity.ok(response);
    }
}
