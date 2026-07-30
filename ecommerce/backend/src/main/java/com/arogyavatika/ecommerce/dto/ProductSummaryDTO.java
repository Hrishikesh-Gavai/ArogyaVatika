package com.arogyavatika.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class ProductSummaryDTO {
    private String p_id;
    private String name;
    private double amt;
    private int quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> img;
    private List<String> categories;
}
