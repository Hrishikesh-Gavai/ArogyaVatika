package com.arogyavatika.ecommerce.entities;

import com.arogyavatika.ecommerce.dto.BusinessSummaryDTO;
import com.arogyavatika.ecommerce.dto.OrderDTO;
import com.arogyavatika.ecommerce.dto.ProductSummaryDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection="ecommerce_users")
@Data
public class User {
    @Id
    private ObjectId id;
    @Indexed(unique=true)
    @NonNull
    private String username;
    private String email;
    private String profile;
    private LocalDateTime created;
    @NonNull
    private String pass;
    @Transient
    @JsonProperty("_id")
    private String stringId;
    private List<ProductSummaryDTO> addToCart=new ArrayList<>();
    private List<OrderDTO> orderPlace=new ArrayList<>();
    private List<BusinessSummaryDTO> businessOwned=new ArrayList<>();
    private List<String> role=new ArrayList<>();

    public String getStringId(){
        return id.toHexString();
    }
}
