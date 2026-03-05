package com.ecommerceproject.modal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode

public class Deals {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @jakarta.validation.constraints.NotNull(message = "Discount is required")
    @jakarta.validation.constraints.Min(value = 0, message = "Discount cannot be negative")
    @jakarta.validation.constraints.Max(value = 100, message = "Discount cannot exceed 100")
    private Integer discount;

    @OneToOne
    @jakarta.validation.constraints.NotNull(message = "Home Category is required")
    private HomeCategory category;

}
