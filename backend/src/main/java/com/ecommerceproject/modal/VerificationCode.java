package com.ecommerceproject.modal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode

public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @jakarta.validation.constraints.NotBlank(message = "OTP is required")
    private String otp;

    @jakarta.validation.constraints.NotBlank(message = "Email is required")
    private String email;

    @OneToOne
    private User user;

    @OneToOne
    private Seller seller;

}
