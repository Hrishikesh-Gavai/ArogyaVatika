package com.arogyavatika.ecommerce.controller;

import com.arogyavatika.ecommerce.entities.User;
import com.arogyavatika.ecommerce.repository.UserRepository;
import com.arogyavatika.ecommerce.services.JwtServices;
import com.arogyavatika.ecommerce.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserServices userServices;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtServices jwtServices;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User u) {
        if (u != null) {
            userServices.addUser(u);
            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        }
        return new ResponseEntity<>("Invalid request", HttpStatus.BAD_REQUEST);
    }

    // With formLogin or basicAuth, you don't need explicit /login endpoint
    // Spring Security handles /login automatically!

    @PostMapping("/login")
    public ResponseEntity<?> verify(@RequestBody User u) {
        Authentication auth=authManager.authenticate(new UsernamePasswordAuthenticationToken(u.getUsername(),u.getPass()));
        if(auth.isAuthenticated()){
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String token = jwtServices.generateToken(userDetails); // pass userDetails here
            return new ResponseEntity<>(token,HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.LOCKED);
        }

    }
}
