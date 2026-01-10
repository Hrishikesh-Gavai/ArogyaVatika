package com.arogyavatika.ecommerce.entities;

import com.arogyavatika.ecommerce.dto.BusinessSummaryDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection="Product")
@Data
public class Product {
    @Id
    private ObjectId p_id;
    @NonNull
    private String p_name;
    private BusinessSummaryDTO p_belongs;
    @NonNull
    private double amt;
    @NonNull
    private int quantity;
    @Transient
    @JsonProperty("_id")
    private String stringId;
    private String p_desp;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> img=new ArrayList<>();
    private List<String> category=new ArrayList<>();

    public String getStringId(){
        return p_id.toHexString();
    }
}
