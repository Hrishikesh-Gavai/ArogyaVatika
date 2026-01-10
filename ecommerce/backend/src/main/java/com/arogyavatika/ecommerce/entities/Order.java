package com.arogyavatika.ecommerce.entities;

import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="orders")
@Data
public class Order {
    @Id
    private ObjectId o_id;
    @DBRef
    private User orderBy;
    @DBRef
    private Product orderProduct;
    @DBRef
    private Business orderOwns;
    private String address;
    private int o_quantity;
    private boolean paymentdone;
}
