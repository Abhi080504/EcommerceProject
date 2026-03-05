package com.ecommerceproject.product.modal;

import com.ecommerceproject.product.domain.HomecategorySection;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class HomeCategory implements java.io.Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotBlank(message = "Category Name is required")
    private String name;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    @NotBlank(message = "Image is required")
    private String image;

    @NotBlank(message = "Category ID is required")
    private String categoryId;

    private HomecategorySection section;
}
