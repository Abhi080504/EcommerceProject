package com.ecommerceproject.product.modal;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(indexes = {
        @Index(name = "idx_product_title", columnList = "title"),
        @Index(name = "idx_product_category", columnList = "category_id")
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product implements java.io.Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @Min(value = 0)
    private int mrpPrice;

    @Min(value = 0)
    private int sellingPrice;

    @Min(value = 0)
    @Max(value = 100)
    private int discountPercent;

    private int quantity;

    private String color;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> images = new ArrayList<>();

    private int numRatings;

    private double averageRating;

    @ManyToOne
    private Category category;

    // Decoupled: Reference seller by ID
    private Long sellerId;

    private LocalDateTime createdAt;

    private String brand;

    @Column(length = 2000)
    private String brandDescription;

    private String sizes;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Review> reviews = new ArrayList<>();
}
