package com.ecommerceproject.modal;

import jakarta.persistence.*;
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

public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @jakarta.validation.constraints.NotBlank(message = "Title is required")
  private String title;

  @jakarta.validation.constraints.NotBlank(message = "Description is required")
  private String description;

  @jakarta.validation.constraints.Min(value = 0)
  private int mrpPrice;

  @jakarta.validation.constraints.Min(value = 0)
  private int sellingPrice;

  @jakarta.validation.constraints.Min(value = 0)
  @jakarta.validation.constraints.Max(value = 100)
  private int discountPercent;

  private int quantity;

  private String color;

  @ElementCollection
  private List<String> images = new ArrayList<>();

  private int numRatings;

  private double averageRating;

  @ManyToOne
  private Category category;

  @ManyToOne
  private Seller seller;

  private LocalDateTime createdAt;

  private String brand;
  @Column(length = 2000)
  private String brandDescription;

  // @ElementCollection
  private String Sizes;

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Review> reviews = new ArrayList<>();

}
