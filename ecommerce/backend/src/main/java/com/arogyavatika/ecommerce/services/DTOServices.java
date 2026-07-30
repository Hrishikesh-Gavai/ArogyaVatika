package com.arogyavatika.ecommerce.services;

import com.arogyavatika.ecommerce.dto.*;
import com.arogyavatika.ecommerce.entities.Business;
import com.arogyavatika.ecommerce.entities.Order;
import com.arogyavatika.ecommerce.entities.Product;
import com.arogyavatika.ecommerce.entities.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DTOServices {

    public ProductSummaryDTO toProductDTO(Product p) {
        return new ProductSummaryDTO(p.getP_id().toHexString(),p.getP_name(),p.getAmt(),p.getQuantity(),p.getCreatedAt(),p.getUpdatedAt(),p.getImg(),p.getCategory());
    }

    public BusinessSummaryDTO toBusinessDTO(Business b) {
        return new BusinessSummaryDTO(b.getB_id().toHexString(), b.getB_name(), b.getB_profile(),b.getB_desp());
    }

    public BusinessPublicDTO businessPublicDTO(Business b){
        return new BusinessPublicDTO(b.getB_id().toHexString()
                ,b.getB_name()
                ,b.getB_profile()
                ,b.getB_desp()
                ,b.getProducts());
    }

    public OrderDTO toOrderDTO(Order o) {
        return new OrderDTO(
                o.getO_id().toHexString(),
                o.getOrderBy().getUsername(),
                o.getOrderOwns().getB_id().toHexString(),
                o.getOrderProduct().getP_id().toHexString(),
                o.getOrderProduct().getP_name(),
                o.getAddress(),
                o.getO_quantity(),
                o.isPaymentdone()
        );
    }

    public UserDTO toUserDTO(User u){
        return new UserDTO(
                u.getUsername(),
                u.getPass(),
                u.getProfile(),
                u.getEmail()
        );
    }
}
