package com.arogyavatika.ecommerce.controller;

import com.arogyavatika.ecommerce.dto.OrderDTO;
import com.arogyavatika.ecommerce.entities.Business;
import com.arogyavatika.ecommerce.entities.Order;
import com.arogyavatika.ecommerce.entities.Product;
import com.arogyavatika.ecommerce.entities.User;
import com.arogyavatika.ecommerce.services.BusinessServices;
import com.arogyavatika.ecommerce.services.OrderServices;
import com.arogyavatika.ecommerce.services.ProductServices;
import com.arogyavatika.ecommerce.services.UserServices;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    //User Services Endpoints

    @Autowired
    private UserServices UserServices;

    @Autowired
    private OrderServices OrderServices;

    @Autowired
    private ProductServices ProductServices;

    @Autowired
    private BusinessServices BusinessServices;

    @GetMapping("/all-users")
    public ResponseEntity<?> getAll(){              //to get all user list (admin)
        List<User> u = UserServices.getAll();
        if(u!=null){
            return new ResponseEntity<>(u, HttpStatus.OK);
        }
        return new ResponseEntity<>(null,HttpStatus.NO_CONTENT);
    }

    @PostMapping("/add-admin")
    public ResponseEntity<?> add(@RequestBody User u){
        try{
            UserServices.addAdmin(u);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-user/{id}")          //to get user by id(admin)
    public ResponseEntity<?> getById(@PathVariable ObjectId id){
        User u= UserServices.getById(id);
        if(u!=null){
            return new ResponseEntity<>(u,HttpStatus.OK);
        }
        return new ResponseEntity<>(null,HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("{id}")      //to delete user(admin)
    public ResponseEntity<?> deleteById(@PathVariable ObjectId id){
        UserServices.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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

    @GetMapping("/all-order")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<OrderDTO> orders = OrderServices.getAll();
            return ResponseEntity.ok(orders); // Always return OK with empty array if no orders
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching orders: " + e.getMessage());
        }
    }

    @GetMapping("/get-order/{o_id}")                      //to get order by id (admin and business)
    public ResponseEntity<?> getBy0Id(@PathVariable ObjectId o_id){
        try{
            Order b=OrderServices.getById(o_id);
            if(b==null) throw new NullPointerException();
            return new ResponseEntity<>(b,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all-business")
    public ResponseEntity<?> getAllB(){             //to get all business enroll (admin)
        try{
            return new ResponseEntity<>(BusinessServices.getAll(), HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/get-business/{b_id}")                        //to get business by id (owner , admin)
    public ResponseEntity<?> getBybId(@PathVariable ObjectId b_id) {
        try {
            Business b = BusinessServices.getById(b_id);
            if (b == null) throw new NullPointerException();
            return new ResponseEntity<>(b, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/cancel-order/{o_id}")              //to delete order(user,admin and business)
    public ResponseEntity<?>delete(@PathVariable ObjectId o_id) {
        if (OrderServices.AddeleteOrder(o_id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
