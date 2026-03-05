package com.ecommerceproject.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode

public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private Cart cart;

    @ManyToOne
    private Product product;

    private String size;

    @jakarta.validation.constraints.Min(value = 1, message = "Quantity must be at least 1")
    private int quantity = 1;

    private Integer mrpPrice;

    private Integer sellingPrice;

    private Long userId;

}
