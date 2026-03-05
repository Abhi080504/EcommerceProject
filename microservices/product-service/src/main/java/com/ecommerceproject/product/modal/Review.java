package com.ecommerceproject.product.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Review implements java.io.Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String reviewText;

    @Column(nullable = false)
    private double rating;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> productImages;

    @JsonIgnore
    @ManyToOne
    private Product product;

    // Decoupled: Reference user by ID
    private Long userId;
    private String userFullName;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
