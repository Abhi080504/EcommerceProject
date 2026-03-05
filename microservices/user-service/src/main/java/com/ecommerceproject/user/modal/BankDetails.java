package com.ecommerceproject.user.modal;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankDetails {

    private String accountNumber;
    private String accountHolderName;
    private String ifscCode;

}
