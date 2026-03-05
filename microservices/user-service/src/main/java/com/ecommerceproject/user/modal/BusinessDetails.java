package com.ecommerceproject.user.modal;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessDetails {

    private String bussinessName;
    private String bussinessEmail;
    private String bussinessMobile;
    private String bussinessAddress;
    private String logo;
    private String banner;

}
