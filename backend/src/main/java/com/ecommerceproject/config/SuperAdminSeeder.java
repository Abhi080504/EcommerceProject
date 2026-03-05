package com.ecommerceproject.config;

import com.ecommerceproject.domain.AccountStatus;
import com.ecommerceproject.domain.USER_ROLE;
import com.ecommerceproject.modal.User;
import com.ecommerceproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SuperAdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        User existingUser = userRepository.findByEmail("superadmin@ecommerce.com");

        if (existingUser != null) {
            boolean updated = false;
            // Migration logic: Fix role if it's the old invalid one
            if (existingUser.getRole().equals(USER_ROLE.ROLE_SUPER_ADMIN)) {
                existingUser.setRole(USER_ROLE.ROLE_SUPER);
                updated = true;
                System.out.println("SEEDER: Migrated Super Admin role from SUPER_ADMIN to SUPER.");
            }

            if (existingUser.getAccountStatus() != AccountStatus.ACTIVE) {
                existingUser.setAccountStatus(AccountStatus.ACTIVE);
                updated = true;
                System.out.println("SEEDER: Activated Super Admin account.");
            }

            if (updated) {
                userRepository.save(existingUser);
            }
            return;
        }

        User user = new User();
        user.setEmail("superadmin@ecommerce.com");
        user.setFullName("Super Admin");
        user.setMobile("9999999999");
        user.setRole(USER_ROLE.ROLE_SUPER);
        user.setAccountStatus(AccountStatus.ACTIVE);
        // We set a default password, but login is via OTP usually.
        // However, we need a password for the entity constraints usually.
        user.setPassword(passwordEncoder.encode("superadmin"));

        userRepository.save(user);
        System.out.println("SEEDER: Super Admin created successfully.");
    }
}
