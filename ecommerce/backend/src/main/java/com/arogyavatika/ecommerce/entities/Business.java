package com.arogyavatika.ecommerce.entities;

import com.arogyavatika.ecommerce.dto.OrderDTO;
import com.arogyavatika.ecommerce.dto.ProductSummaryDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection="Business")
@Data
public class Business {
    @Id
    private ObjectId b_id;
    @NonNull
    private String b_name;
    private String owner;
    @Transient
    @JsonProperty("_id")
    private String stringId;
    private String b_profile;
    private String b_desp;
    private List<ProductSummaryDTO> products=new ArrayList<>();
    private List<OrderDTO> orders=new ArrayList<>();

    public String getStringId(){
        return b_id.toHexString();
    }
}
