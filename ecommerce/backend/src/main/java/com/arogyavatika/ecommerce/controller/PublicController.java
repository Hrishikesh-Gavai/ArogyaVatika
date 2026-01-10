package com.arogyavatika.ecommerce.controller;

import com.arogyavatika.ecommerce.dto.BusinessPublicDTO;
import com.arogyavatika.ecommerce.entities.Business;
import com.arogyavatika.ecommerce.entities.User;
import com.arogyavatika.ecommerce.services.BusinessServices;
import com.arogyavatika.ecommerce.services.ProductServices;
import com.arogyavatika.ecommerce.services.UserServices;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private UserServices UserServices;

    @Autowired
    private ProductServices ProductServices;

    @Autowired
    private BusinessServices BusinessServices;

    @GetMapping("/health")
    public String ok(){
        return "ok";
    }

    @GetMapping("/all-products")
    public ResponseEntity<?> getAll(){          //to show all product (user & admin)
        try{
            return new ResponseEntity<>(ProductServices.getAll(), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/see-business/{b_id}")
    public ResponseEntity<?> see(@PathVariable ObjectId b_id){
        try {
            BusinessPublicDTO b= BusinessServices.publicBusiness(b_id);
            return new ResponseEntity<>(b,HttpStatus.OK);
        }catch(Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
