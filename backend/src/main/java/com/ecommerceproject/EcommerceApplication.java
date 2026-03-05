package com.ecommerceproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableCaching
@EnableAsync
@EntityScan("com.ecommerceproject.modal") // <--- 1. Force it to find your Users
@EnableJpaRepositories("com.ecommerceproject.repository") // <--- 2. Force it to find Repos
public class EcommerceApplication {

	public static void main(String[] args) {

		// 3. THIS IS THE MAGIC LINE TO FIX YOUR TABLES
		System.setProperty("spring.jpa.hibernate.ddl-auto", "update");
		SpringApplication.run(EcommerceApplication.class, args);

	}

}

