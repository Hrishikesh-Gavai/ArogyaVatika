package com.arogyavatika.ecommerce.services;

import com.arogyavatika.ecommerce.entities.User;
import com.arogyavatika.ecommerce.entities.UserPrincipal;
import com.arogyavatika.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class MyUserDetailsServices implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u=userRepository.findByUsername(username);
        if(u==null){
            throw new UsernameNotFoundException("User not found :");
        }
        return new UserPrincipal(u);
    }
}
