package com.ecommerceproject.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateReviewRequest {

    @jakarta.validation.constraints.NotBlank(message = "Review text is required")
    private String reviewText;

    @jakarta.validation.constraints.Min(value = 1, message = "Rating must be at least 1")
    @jakarta.validation.constraints.Max(value = 5, message = "Rating must be at most 5")
    private double reviewRating;
    private List<String> productImages;

}
