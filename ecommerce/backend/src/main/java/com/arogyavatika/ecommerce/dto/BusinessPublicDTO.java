package com.arogyavatika.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BusinessPublicDTO {
    private String id;
    private String name;
    private String profile;
    private String desp;
    private List<ProductSummaryDTO> products;
}
