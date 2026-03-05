package com.ecommerceproject.auth.modal;

import com.ecommerceproject.auth.domain.AccountStatus;
import com.ecommerceproject.auth.domain.USER_ROLE;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String email;

    private String fullName;

    private String mobile;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private USER_ROLE role = USER_ROLE.ROLE_CUSTOMER;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Address> addresses = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;

    @ElementCollection
    @CollectionTable(name = "user_used_coupons", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "coupon_id")
    private Set<Long> usedCouponIds = new HashSet<>();
}
