package com.arogyavatika.ecommerce.controller;

import com.arogyavatika.ecommerce.entities.Order;
import com.arogyavatika.ecommerce.entities.Product;
import com.arogyavatika.ecommerce.services.OrderServices;
import com.arogyavatika.ecommerce.services.ProductServices;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product")
public class ProductController {
    @Autowired
    private ProductServices ProductServices;


    @GetMapping("/{p_id}")
    public ResponseEntity<?> getById(@PathVariable ObjectId p_id){             //to get info of product by id (admin)
        try{
            Product b=ProductServices.getById(p_id);
            if(b==null) throw new NullPointerException();
            return new ResponseEntity<>(b,HttpStatus.FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

}
