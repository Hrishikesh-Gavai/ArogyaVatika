package com.arogyavatika.ecommerce.services;

import com.arogyavatika.ecommerce.dto.BusinessSummaryDTO;
import com.arogyavatika.ecommerce.dto.ProductSummaryDTO;
import com.arogyavatika.ecommerce.dto.UserDTO;
import com.arogyavatika.ecommerce.entities.Business;
import com.arogyavatika.ecommerce.entities.Product;
import com.arogyavatika.ecommerce.entities.User;
import com.arogyavatika.ecommerce.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UserServices {
    @Autowired
    private UserRepository UserRepository;

    @Autowired
    private BusinessServices BusinessService;

    @Autowired
    private ProductServices ProductServices;

    @Autowired
    private DTOServices Dto;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final PasswordEncoder p=new BCryptPasswordEncoder();

    public List<User> getAll(){
        return UserRepository.findAll();
    }

    public User getById(ObjectId id){
        return UserRepository.findById(id).orElse(null);
    }

    public User addUser(User u){
        try {
            u.setCreated(LocalDateTime.now());
            u.getRole().add("USER");
            u.setPass(p.encode(u.getPass()));
            UserRepository.save(u);
            return u;
        }catch(Exception e) {
            throw e;
        }
    }

    public User addAdmin(User u){
        try {
            u.setCreated(LocalDateTime.now());
            u.getRole().addAll(Arrays.asList("USER", "ADMIN"));
            u.setPass(p.encode(u.getPass()));
            UserRepository.save(u);
            return u;
        }catch(Exception e) {
            throw e;
        }
    }

    public void deleteById(ObjectId id){
        try{
            User u=UserRepository.findById(id).orElse(null);
            List<BusinessSummaryDTO> b = u.getBusinessOwned();
            if(b != null) {
                for(BusinessSummaryDTO bi : b) {
                    Business i = BusinessService.getBusinessFromDTO(bi);
                    BusinessService.deleteBusiness(i.getB_id());
                }
            }
            UserRepository.deleteById(id);
        }catch(Exception e){
            System.out.println(e.getMessage());
        }
    }

    public void addToCart(String username,ObjectId pid) throws Exception{
            User u = UserRepository.findByUsername(username);
            Product p = ProductServices.getById(pid);
            ProductSummaryDTO pd=Dto.toProductDTO(p);
            u.getAddToCart().add(pd);
            UserRepository.save(u);
    }

    public void updatePass(String username,String p){
        User old=UserRepository.findByUsername(username);
        if(old==null || p==null) throw new NullPointerException();
        old.setPass(passwordEncoder.encode(p));
        UserRepository.save(old);
    }

    public void updateUsername(String username, UserDTO u) {
        User old = UserRepository.findByUsername(username);
        if (old == null || u == null) throw new NoSuchElementException();

        old.setUsername((u.getUsername() == null || u.getUsername().isEmpty()) ? old.getUsername() : u.getUsername());
        old.setEmail((u.getEmail() == null || u.getEmail().isEmpty()) ? old.getEmail() : u.getEmail());
        old.setProfile((u.getProfile() == null) ? old.getProfile() : u.getProfile());

        // ✅ only update password if user entered something
        if (u.getPass() != null && !u.getPass().isEmpty()) {
            old.setPass(passwordEncoder.encode(u.getPass()));
        }

        UserRepository.save(old);
    }


    public void removeByCart(String currentUsername, String pId) throws Exception {
        User u = UserRepository.findByUsername(currentUsername);
        if (u == null) throw new NoSuchElementException("User not found");

        List<ProductSummaryDTO> cart = u.getAddToCart();
        boolean removed = cart.removeIf(item -> item.getP_id().equals(pId));

        if (!removed) throw new NoSuchElementException("Product not found in cart");

        UserRepository.save(u);
    }

}
