package com.arogyavatika.ecommerce.controller;

import com.arogyavatika.ecommerce.dto.BusinessPublicDTO;
import com.arogyavatika.ecommerce.dto.BusinessSummaryDTO;
import com.arogyavatika.ecommerce.dto.UserDTO;
import com.arogyavatika.ecommerce.entities.Business;
import com.arogyavatika.ecommerce.entities.Product;
import com.arogyavatika.ecommerce.entities.User;
import com.arogyavatika.ecommerce.repository.UserRepository;
import com.arogyavatika.ecommerce.services.BusinessServices;
import com.arogyavatika.ecommerce.services.OrderServices;
import com.arogyavatika.ecommerce.services.ProductServices;
import com.arogyavatika.ecommerce.services.UserServices;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServices UserServices;

    @Autowired
    private ProductServices ProductServices;

    @Autowired
    private OrderServices OrderServices;

    @Autowired
    private BusinessServices BusinessServices;

    @Autowired
    private UserRepository UserRepository;

    @GetMapping
    public ResponseEntity<?> getInfo(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String currentUsername=authentication.getName();
        User u=UserRepository.findByUsername(currentUsername);
        if(u != null){
            return new ResponseEntity<>(u,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/delete-acc")      //to delete user(admin)
    public ResponseEntity<?> deleteU(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String currentUsername=authentication.getName();
        User u = UserRepository.findByUsername(currentUsername);
        if (u != null) {
            UserRepository.delete(u);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/add-to-cart/{p_id}")        //to add to cart (user)
    public ResponseEntity<?> addToCart(@PathVariable ObjectId p_id){
        try {
            Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
            String currentUsername=authentication.getName();
            UserServices.addToCart(currentUsername, p_id);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
        }
    }

    @DeleteMapping("/remove-from-cart/{p_id}")
    public ResponseEntity<?> removeByCart(@PathVariable String p_id){
        try {
            Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
            String currentUsername=authentication.getName();
            UserServices.removeByCart(currentUsername, p_id);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-product-for")           //for getting cart product for given user (user)
    public ResponseEntity<?> getProductFor(){
        try{
            Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
            String currentUsername=authentication.getName();
            return new ResponseEntity<>(ProductServices.getProductForUser(currentUsername),HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
        }
    }

    @PutMapping("/change-pass/{pass}")
    public ResponseEntity<?> changePass(@PathVariable String pass){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        UserServices.updatePass(currentUsername,pass);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> changeName(@RequestBody UserDTO u) {
        // Get currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName(); // logged-in username

        // Call service to update the name
        UserServices.updateUsername(currentUsername,u);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/placed-order/{p_id}/{b_id}/{o_quantity}")          //to create order(user)
    public ResponseEntity<?> save(@PathVariable String p_id,@PathVariable String b_id,@RequestBody String address,@PathVariable int o_quantity){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        if(OrderServices.saveOrder(currentUsername,p_id,b_id,address,o_quantity)){
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/cancel-order/{o_id}")              //to delete order(user,admin and business)
    public ResponseEntity<?>delete(@PathVariable ObjectId o_id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();
            OrderServices.deleteOrder(o_id, currentUsername);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    }

    @PostMapping("/add-business")                      //to created business for user (user)
    public ResponseEntity<?> save(@RequestBody Business b){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        if(BusinessServices.addBusiness(currentUsername,b)){
            return new ResponseEntity<>(b,HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/delete-business/{b_id}")                   //to delete business (user and admin)
    public ResponseEntity<?> deleteb(@PathVariable ObjectId b_id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        BusinessServices.deleteBusiness(b_id,currentUsername);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/order-history/{oId}")
    public ResponseEntity<?> deleteHistory(@PathVariable String oId){
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();
            OrderServices.deleteUserOrder(oId,currentUsername);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-product/{p_id}")
    public ResponseEntity<?> getBypId(@PathVariable ObjectId p_id){             //to get info of product by id (admin)
        try{
            Product b= ProductServices.getById(p_id);
            if(b==null) throw new NullPointerException();
            return new ResponseEntity<>(b,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }
}
