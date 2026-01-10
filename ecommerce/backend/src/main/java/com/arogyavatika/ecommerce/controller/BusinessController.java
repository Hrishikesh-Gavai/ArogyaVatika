package com.arogyavatika.ecommerce.controller;

import com.arogyavatika.ecommerce.services.BusinessServices;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business")
public class BusinessController {

    @Autowired
    private BusinessServices BusinessServices;

    @DeleteMapping("{b_id}")                   //to delete business (user and admin)
    public ResponseEntity<?>delete(@PathVariable ObjectId b_id){
        BusinessServices.deleteBusiness(b_id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
