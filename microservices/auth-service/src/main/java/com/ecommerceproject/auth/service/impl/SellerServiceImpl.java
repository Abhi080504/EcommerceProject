package com.ecommerceproject.auth.service.impl;

import com.ecommerceproject.auth.config.JwtProvider;
import com.ecommerceproject.auth.domain.AccountStatus;
import com.ecommerceproject.auth.modal.Seller;
import com.ecommerceproject.auth.repository.SellerRepository;
import com.ecommerceproject.auth.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final JwtProvider jwtProvider;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final com.ecommerceproject.auth.repository.AddressRepository addressRepository;
    private final org.springframework.data.redis.core.StringRedisTemplate redisTemplate;

    @Override
    public Seller getSellerProfile(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt);
        // Robust check: handle potential "seller_" prefix in the JWT email claim
        String cleanEmail = email.startsWith("seller_") ? email.substring(7) : email;

        Seller seller = sellerRepository.findByEmailIgnoreCase(cleanEmail);
        if (seller == null) {
            throw new Exception("Seller not found with email: " + cleanEmail);
        }
        return seller;
    }

    @Override
    public Seller createSeller(Seller seller) throws Exception {
        Seller existSeller = sellerRepository.findByEmailIgnoreCase(seller.getEmail());
        if (existSeller != null) {
            throw new Exception("Seller already exists with this email");
        }

        com.ecommerceproject.auth.modal.Address savedAddress = addressRepository.save(seller.getPickupAddress());

        Seller newSeller = new Seller();
        newSeller.setEmail(seller.getEmail());
        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
        newSeller.setSellerName(seller.getSellerName());
        newSeller.setPickupAddress(savedAddress);
        newSeller.setGSTIN(seller.getGSTIN());
        newSeller.setRole(com.ecommerceproject.auth.domain.USER_ROLE.ROLE_SELLER);
        newSeller.setMobile(seller.getMobile());
        newSeller.setBankDetails(seller.getBankDetails());
        newSeller.setBussinessDetails(seller.getBussinessDetails());
        newSeller.setAccountStatus(AccountStatus.PENDING_VERIFICATION);

        return sellerRepository.save(newSeller);
    }

    @Override
    public Seller getSellerById(Long id) throws Exception {
        return sellerRepository.findById(id).orElseThrow(() -> new Exception("Seller not found with id " + id));
    }

    @Override
    public Seller getSellerByEmail(String email) throws Exception {
        Seller seller = sellerRepository.findByEmailIgnoreCase(email);
        if (seller == null) {
            throw new Exception("Seller not found with email " + email);
        }
        return seller;
    }

    @Override
    public java.util.List<Seller> getAllSellers(AccountStatus status) {
        if (status != null) {
            return sellerRepository.findByAccountStatus(status);
        }
        return sellerRepository.findAll();
    }

    @Override
    public Seller updateSeller(Long id, Seller seller) throws Exception {
        Seller existingSeller = getSellerById(id);

        if (seller.getSellerName() != null)
            existingSeller.setSellerName(seller.getSellerName());
        if (seller.getMobile() != null)
            existingSeller.setMobile(seller.getMobile());
        if (seller.getEmail() != null)
            existingSeller.setEmail(seller.getEmail());

        if (seller.getBussinessDetails() != null) {
            if (seller.getBussinessDetails().getBussinessName() != null)
                existingSeller.getBussinessDetails().setBussinessName(seller.getBussinessDetails().getBussinessName());
            // Update other details as needed
        }

        if (seller.getBankDetails() != null) {
            if (seller.getBankDetails().getAccountHolderName() != null)
                existingSeller.getBankDetails().setAccountHolderName(seller.getBankDetails().getAccountHolderName());
            if (seller.getBankDetails().getAccountNumber() != null)
                existingSeller.getBankDetails().setAccountNumber(seller.getBankDetails().getAccountNumber());
            if (seller.getBankDetails().getIfscCode() != null)
                existingSeller.getBankDetails().setIfscCode(seller.getBankDetails().getIfscCode());
        }

        if (seller.getPickupAddress() != null) {
            com.ecommerceproject.auth.modal.Address address = existingSeller.getPickupAddress();
            if (seller.getPickupAddress().getAddress() != null)
                address.setAddress(seller.getPickupAddress().getAddress());
            if (seller.getPickupAddress().getCity() != null)
                address.setCity(seller.getPickupAddress().getCity());
            if (seller.getPickupAddress().getState() != null)
                address.setState(seller.getPickupAddress().getState());
            if (seller.getPickupAddress().getMobile() != null)
                address.setMobile(seller.getPickupAddress().getMobile());
            if (seller.getPickupAddress().getPincode() != null)
                address.setPincode(seller.getPickupAddress().getPincode());
            addressRepository.save(address);
        }

        return sellerRepository.save(existingSeller);
    }

    @Override
    public Seller verifyEmail(String email, String otp) throws Exception {
        String storedOtp = redisTemplate.opsForValue().get("otp:" + email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            throw new Exception("Wrong OTP");
        }
        // If needed, fetch seller and mark verified, but currently verifyEmail just
        // checks OTP in this context?
        // Wait, normally this returns a Seller.
        Seller seller = sellerRepository.findByEmailIgnoreCase(email);
        if (seller == null)
            throw new Exception("Seller not found");

        seller.setEmailVerified(true);
        sellerRepository.save(seller);
        redisTemplate.delete("otp:" + email);
        return seller;
    }

    @Override
    public Seller updateSellerAccountStatus(Long id, AccountStatus status) throws Exception {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new Exception("Seller not found"));
        seller.setAccountStatus(status);
        return sellerRepository.save(seller);
    }
}
