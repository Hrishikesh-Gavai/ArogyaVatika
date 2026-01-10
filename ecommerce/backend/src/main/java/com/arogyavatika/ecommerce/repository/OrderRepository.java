package com.arogyavatika.ecommerce.repository;

import com.arogyavatika.ecommerce.entities.Order;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;

@Component
public interface OrderRepository extends MongoRepository<Order, ObjectId> {
}
