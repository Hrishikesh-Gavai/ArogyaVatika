package com.arogyavatika.ecommerce.repository;

import com.arogyavatika.ecommerce.entities.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;

@Component
public interface UserRepository extends MongoRepository<User, ObjectId> {
    User findByUsername(String username);
}
