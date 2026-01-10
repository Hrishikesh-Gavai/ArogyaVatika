package com.arogyavatika.ecommerce.controller;

import com.arogyavatika.ecommerce.dto.BusinessSummaryDTO;
import com.arogyavatika.ecommerce.dto.OrderDTO;
import com.arogyavatika.ecommerce.dto.ProductSummaryDTO;
import com.arogyavatika.ecommerce.entities.Business;
import com.arogyavatika.ecommerce.entities.Product;
import com.arogyavatika.ecommerce.services.BusinessServices;
import com.arogyavatika.ecommerce.services.OrderServices;
import com.arogyavatika.ecommerce.services.ProductServices;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner")
public class OwnerController {
    @Autowired
    private ProductServices ProductServices;

    @Autowired
    private OrderServices OrderServices;

    @Autowired
    private BusinessServices BusinessServices;

    @PostMapping("/add-product/{b_id}")
    public ResponseEntity<?> save(@PathVariable ObjectId b_id, @RequestBody Product b) {       //to save product b using business id (admin and business)
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();
            if(!BusinessServices.isOwner(currentUsername,b_id)){
                return new ResponseEntity<>("Unauthorized :You not own this Business!",HttpStatus.FORBIDDEN);
            }
            if (ProductServices.saveProduct(b_id, b)) {
                return new ResponseEntity<>(HttpStatus.CREATED);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid ObjectId", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/confirm-payment/{o_id}")
    public ResponseEntity<?> confirm(@PathVariable ObjectId o_id){
        try{
            OrderServices.confirmPay(o_id);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(Exception e){
            return  new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @DeleteMapping("/delete-product/{p_id}")                     //to delete product(admin and business)
    public ResponseEntity<?>delete(@PathVariable ObjectId p_id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        if(!ProductServices.isOwner(currentUsername,p_id)){
            return new ResponseEntity<>("Unauthorized :You not own this Product!",HttpStatus.FORBIDDEN);
        }
        if (ProductServices.deleteProduct(p_id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/order/{b_id}")
    public ResponseEntity<?> getOrders(@PathVariable ObjectId b_id){
        try {
            Business b = BusinessServices.getById(b_id);
            List<OrderDTO> orders = b.getOrders();
            return new ResponseEntity<>(orders,HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update/{p_id}")
    public ResponseEntity<?> updateProductDetails(@RequestBody ProductSummaryDTO p, @PathVariable ObjectId p_id){
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();

            if(!ProductServices.isOwner(currentUsername,p_id)){
                return new ResponseEntity<>("Unauthorized :You not own this Product!",HttpStatus.FORBIDDEN);
            }
            ProductServices.update(p_id,p);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-business")
    public ResponseEntity<?> getBussinessOwned(){
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();
            List<BusinessSummaryDTO> b = BusinessServices.getFor(currentUsername);
            return new ResponseEntity<>(b,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/business/{b_id}")
    public ResponseEntity<?> getBusinessEntity(@PathVariable ObjectId b_id){
        try{
            Business b=BusinessServices.getById(b_id);
            if(b==null) throw new NullPointerException();
            return new ResponseEntity<>(b,HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{b_id}")
    public ResponseEntity<?> getProductForBusiness(@PathVariable ObjectId b_id){
        try{
            List<Product> p=ProductServices.getProductForBusiness(b_id);
            return new ResponseEntity<>(p,HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/order-history/{oId}/{bId}")
    public ResponseEntity<?> deleteHistory(@PathVariable String oId ,@PathVariable ObjectId bId){
        try{
            OrderServices.deleteBusinessOrder(oId,bId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
