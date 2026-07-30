package com.arogyavatika.ecommerce.repository;

import com.arogyavatika.ecommerce.entities.Business;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;

@Component
public interface BusinessRepository extends MongoRepository<Business, ObjectId> {
}
