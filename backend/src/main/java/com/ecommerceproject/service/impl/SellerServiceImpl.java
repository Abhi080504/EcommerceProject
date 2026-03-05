package com.ecommerceproject.service.impl;

import com.ecommerceproject.config.JwtProvider;
import com.ecommerceproject.domain.AccountStatus;
import com.ecommerceproject.domain.USER_ROLE;
import com.ecommerceproject.exceptions.SellerException;
import com.ecommerceproject.modal.Address;
import com.ecommerceproject.modal.Seller;
import com.ecommerceproject.repository.AddressRepository;
import com.ecommerceproject.repository.SellerRepository;
import com.ecommerceproject.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;

    @Override
    public Seller getSellerProfile(String jwt) throws SellerException {
        System.out.println(
                "🔍 SellerServiceImpl: getSellerProfile called, jwt arg is " + (jwt == null ? "null" : "present"));

        if (jwt == null) {
            org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            if (authentication != null) {
                String email = (String) authentication.getPrincipal();
                System.out.println("🔍 SellerServiceImpl: SecurityContext email: " + email);
                return this.getSellerByEmail(email);
            }
            throw new SellerException("Seller Authentication required");
        }
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        return this.getSellerByEmail(email);
    }

    @Override
    public Seller createSeller(Seller seller) {
        Seller sellerExist = sellerRepository.findByEmail(seller.getEmail());

        if (sellerExist != null) {
            throw new RuntimeException("Seller already exist, use different email");

        }
        Address savedAddress = addressRepository.save(seller.getPickUpAddress());

        Seller newSeller = new Seller();
        newSeller.setEmail(seller.getEmail());
        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
        newSeller.setSellerName(seller.getSellerName());
        newSeller.setPickUpAddress(savedAddress);
        newSeller.setGSTIN(seller.getGSTIN());
        newSeller.setRole(USER_ROLE.ROLE_SELLER);
        newSeller.setMobile(seller.getMobile());
        newSeller.setBankDetails(seller.getBankDetails());
        newSeller.setBussinessDetails(seller.getBussinessDetails());

        return sellerRepository.save(newSeller);
    }

    @Override
    public Seller getSellerById(Long id) throws SellerException {

        return sellerRepository.findById(id)
                .orElseThrow(() -> new SellerException("Seller not Found with id " + id));
    }

    @Override
    public Seller getSellerByEmail(String email) throws SellerException {
        Seller seller = sellerRepository.findByEmail(email);
        if (seller == null) {
            throw new SellerException("Seller not Found");
        }
        return seller;
    }

    @Override
    public List<Seller> getAllSellers(AccountStatus status) {
        if (status == null) {
            return sellerRepository.findAll();
        }
        return sellerRepository.findByAccountStatus(status);
    }

    @Override
    public Seller updateSeller(Long id, Seller seller) throws SellerException {
        Seller existingSeller = this.getSellerById(id);

        if (seller.getSellerName() != null) {
            existingSeller.setSellerName(seller.getSellerName());
        }
        if (seller.getMobile() != null) {
            existingSeller.setMobile(seller.getMobile());
        }
        if (seller.getMobile() != null) {
            existingSeller.setMobile(seller.getMobile());
        }

        if (seller.getEmail() != null && !seller.getEmail().isEmpty()) {
            if (!existingSeller.getEmail().equals(seller.getEmail())) {
                Seller isExist = sellerRepository.findByEmail(seller.getEmail());
                if (isExist != null) {
                    throw new SellerException("Email already used by another account");
                }
                existingSeller.setEmail(seller.getEmail());
                existingSeller.setEmailVerified(true); // Trusting the update for now
            }
        }
        if (seller.getBussinessDetails() != null &&
                seller.getBussinessDetails().getBussinessName() != null) {
            if (existingSeller.getBussinessDetails() == null) {
                existingSeller.setBussinessDetails(new com.ecommerceproject.modal.BussinessDetails());
            }
            existingSeller.getBussinessDetails().setBussinessName(
                    seller.getBussinessDetails().getBussinessName());
        }

        if (seller.getBankDetails() != null
                && seller.getBankDetails().getAccountHolderName() != null
                && seller.getBankDetails().getIfscCode() != null
                && seller.getBankDetails().getAccountNumber() != null) {
            if (existingSeller.getBankDetails() == null) {
                existingSeller.setBankDetails(new com.ecommerceproject.modal.BankDetails());
            }
            existingSeller.getBankDetails().setAccountHolderName(
                    seller.getBankDetails().getAccountHolderName());

            existingSeller.getBankDetails().setAccountNumber(
                    seller.getBankDetails().getAccountNumber() // Fixed typo: was getIfscCode
            );

            existingSeller.getBankDetails().setIfscCode(
                    seller.getBankDetails().getIfscCode());
        }

        if (seller.getPickUpAddress() != null
                && seller.getPickUpAddress().getAddress() != null
                && seller.getPickUpAddress().getMobile() != null
                && seller.getPickUpAddress().getCity() != null
                && seller.getPickUpAddress().getState() != null) {
            if (existingSeller.getPickUpAddress() == null) {
                existingSeller.setPickUpAddress(new com.ecommerceproject.modal.Address());
            }
            existingSeller.getPickUpAddress().setAddress(seller.getPickUpAddress().getAddress());

            existingSeller.getPickUpAddress().setCity(seller.getPickUpAddress().getCity());
            existingSeller.getPickUpAddress().setState(seller.getPickUpAddress().getState());
            existingSeller.getPickUpAddress().setMobile(seller.getPickUpAddress().getMobile());
            existingSeller.getPickUpAddress().setPincode(seller.getPickUpAddress().getPincode());
        }
        if (seller.getGSTIN() != null) {
            existingSeller.setGSTIN(seller.getGSTIN());
        }

        return sellerRepository.save(existingSeller);

    }

    @Override
    public void deleteSeller(Long id) throws SellerException {
        Seller seller = getSellerById(id);

        sellerRepository.delete(seller);

    }

    @Override
    public Seller verifyEmail(String email, String otp) throws SellerException {
        Seller seller = getSellerByEmail(email);
        seller.setEmailVerified(true);

        return sellerRepository.save(seller);
    }

    @Override
    public Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws SellerException {
        Seller seller = getSellerById(sellerId);
        seller.setAccountStatus(status);
        seller.setEmailVerified(true);

        return sellerRepository.save(seller);
    }
}
