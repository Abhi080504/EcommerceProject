package com.ecommerceproject.modal;

import com.ecommerceproject.domain.AccountStatus;
import com.ecommerceproject.domain.USER_ROLE;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode

public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @jakarta.validation.constraints.NotBlank(message = "Seller Name is required")
    private String sellerName;

    @jakarta.validation.constraints.NotBlank(message = "Mobile number is required")
    private String mobile;

    @Column(unique = true, nullable = false)
    @jakarta.validation.constraints.Email(message = "Invalid Email")
    @jakarta.validation.constraints.NotBlank(message = "Email is required")
    private String email;

    private String password;

    @Transient
    private String otp;

    @Embedded
    private BussinessDetails bussinessDetails = new BussinessDetails();

    @Embedded
    private BankDetails bankDetails = new BankDetails();

    @OneToOne(cascade = CascadeType.ALL)
    private Address pickUpAddress = new Address();

    private String GSTIN;

    @Enumerated(EnumType.STRING)
    private USER_ROLE role = USER_ROLE.ROLE_SELLER;

    private boolean isEmailVerified = false;

    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;

}
