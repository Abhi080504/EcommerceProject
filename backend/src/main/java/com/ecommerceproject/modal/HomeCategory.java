package com.ecommerceproject.modal;

import com.ecommerceproject.domain.HomecategorySection;
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

public class HomeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @jakarta.validation.constraints.NotBlank(message = "Category Name is required")
    private String name;

    @jakarta.persistence.Lob
    @jakarta.persistence.Column(columnDefinition = "LONGTEXT")
    @jakarta.validation.constraints.NotBlank(message = "Image is required")
    private String image;

    @jakarta.validation.constraints.NotBlank(message = "Category ID is required")
    private String categoryId;

    private HomecategorySection section;

}