package com.ecommerceproject.modal;


import com.ecommerceproject.domain.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class SellerReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @OneToOne
    private Seller seller;

    private Integer totalEarnings = 0;

    private Long totalSales = 0L;

    private Long totalRefunds = 0L;

    private Long totalTaxes = 0L;

    private Long netEarnings = 0L;

    private Integer totalOrders = 0;

    private Integer canceledOrders = 0;

    private Integer totalTransactions = 0;






}
