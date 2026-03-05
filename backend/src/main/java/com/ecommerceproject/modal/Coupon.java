package com.ecommerceproject.modal;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(exclude = "usedByUsers")

public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @jakarta.validation.constraints.NotBlank(message = "Coupon code is required")
    private String code;

    @jakarta.validation.constraints.Min(value = 0, message = "Discount percentage must be non-negative")
    @jakarta.validation.constraints.Max(value = 100, message = "Discount percentage cannot exceed 100")
    private double discountPercentage;

    @jakarta.validation.constraints.NotNull(message = "Start date is required")
    private LocalDate validityStartDate;

    @jakarta.validation.constraints.NotNull(message = "End date is required")
    private LocalDate validityEndDate;

    @jakarta.validation.constraints.Min(value = 0, message = "Minimum order value must be non-negative")
    private double minimumOrderValue;

    private boolean isActive = true;

    @ManyToMany(mappedBy = "usedCoupons")
    private Set<User> usedByUsers = new HashSet<>();

}
