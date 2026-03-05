package com.ecommerceproject.user.modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @jakarta.validation.constraints.NotBlank(message = "Name is required")
    private String name;

    @jakarta.validation.constraints.NotBlank(message = "Local City is required")
    private String localcity;

    @jakarta.validation.constraints.NotBlank(message = "Address is required")
    private String address;

    @jakarta.validation.constraints.NotBlank(message = "City is required")
    private String city;

    @jakarta.validation.constraints.NotBlank(message = "State is required")
    private String state;

    @jakarta.validation.constraints.NotBlank(message = "Pincode is required")
    private String pincode;

    @jakarta.validation.constraints.NotBlank(message = "Mobile is required")
    private String mobile;
}
