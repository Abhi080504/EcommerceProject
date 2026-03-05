package com.ecommerceproject.product.modal;

import jakarta.persistence.*;
import lombok.*;

/**
 * Read-only JPA entity mapped to the shared `seller` table.
 * Used ONLY as a fallback for resolving seller ID from email
 * when the Gateway doesn't inject X-Seller-Id.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "seller")
public class Seller {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String email;
}
