package com.ecommerceproject.controller;

import com.ecommerceproject.modal.Deals;
import com.ecommerceproject.response.ApiResponse;
import com.ecommerceproject.service.DealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/deals")
public class DealController {
        private final DealService dealService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Deals>>> getDeals() {
        List<Deals> deals = dealService.getDeals();
        ApiResponse<List<Deals>> response = new ApiResponse<>(true, "Deals Fetched Successfully", deals,
                HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/deals")
class PublicDealController {
    private final DealService dealService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Deals>>> getDeals() {
        List<Deals> deals = dealService.getDeals();
        ApiResponse<List<Deals>> response = new ApiResponse<>(true, "Deals Fetched Successfully", deals,
                HttpStatus.OK.value());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

        @PostMapping
        public ResponseEntity<ApiResponse<Deals>> createDeals(
                        @Valid @RequestBody Deals deal) {
                Deals createdDeals = dealService.createDeal(deal);

                ApiResponse<Deals> response = new ApiResponse<>(true, "Deal Created Successfully", createdDeals,
                                HttpStatus.CREATED.value());
                return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        @PatchMapping("/{id}")
        public ResponseEntity<ApiResponse<Deals>> updateDeal(
                        @PathVariable Long id,
                        @Valid @RequestBody Deals deal) throws Exception {

                Deals updatedDeal = dealService.updateDeal(deal, id);

                ApiResponse<Deals> response = new ApiResponse<>(true, "Deal Updated Successfully", updatedDeal,
                                HttpStatus.OK.value());
                return ResponseEntity.ok(response);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<String>> deleteDeals(
                        @PathVariable Long id) throws Exception {
                dealService.deleteDeal(id);

                ApiResponse<String> apiResponse = new ApiResponse<>(true, "Deal Deleted Successfully", null,
                                HttpStatus.ACCEPTED.value());

                return new ResponseEntity<>(apiResponse, HttpStatus.ACCEPTED);
        }
}
