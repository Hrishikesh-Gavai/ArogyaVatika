package com.arogyavatika.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderDTO {
    private String o_id;
    private String orderBy;
    private String b_id;
    private String p_id;
    private String p_name;
    private String address;
    private int quantity;
    private boolean pay;
}
