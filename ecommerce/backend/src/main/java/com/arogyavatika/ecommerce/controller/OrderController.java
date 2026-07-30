package com.arogyavatika.ecommerce.controller;


import com.arogyavatika.ecommerce.entities.Order;
import com.arogyavatika.ecommerce.services.OrderServices;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/Order")
public class OrderController {
    @Autowired
    private OrderServices OrderServices;

    @GetMapping("{o_id}")                      //to get order by id (admin and business)
    public ResponseEntity<?> getById(@PathVariable ObjectId o_id){
        try{
            Order b=OrderServices.getById(o_id);
            if(b==null) throw new NullPointerException();
            return new ResponseEntity<>(b,HttpStatus.FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }
}
