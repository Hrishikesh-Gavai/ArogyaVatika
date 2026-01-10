package com.arogyavatika.ecommerce.services;

import com.arogyavatika.ecommerce.dto.BusinessPublicDTO;
import com.arogyavatika.ecommerce.dto.BusinessSummaryDTO;
import com.arogyavatika.ecommerce.dto.ProductSummaryDTO;
import com.arogyavatika.ecommerce.entities.Business;
import com.arogyavatika.ecommerce.entities.Product;
import com.arogyavatika.ecommerce.entities.User;
import com.arogyavatika.ecommerce.repository.BusinessRepository;
import com.arogyavatika.ecommerce.repository.ProductRepository;
import com.arogyavatika.ecommerce.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class BusinessServices {

    @Autowired
    private BusinessRepository BusinessRepository;

    @Autowired
    private ProductRepository ProductRepository;

    @Autowired
    private UserRepository UserRepository;

    @Autowired
    private DTOServices DTOServices;

    public void save(Business b){
        try {
            BusinessRepository.save(b);
        }catch(Exception e){
            throw e;
        }
    }

    public boolean addBusiness(String username,Business b){
        try{
            User u=UserRepository.findByUsername(username);
            if(b==null || u==null) return false;
            if(!u.getRole().contains("OWNER")) u.getRole().add("OWNER");
            BusinessRepository.save(b);
            BusinessSummaryDTO bd=DTOServices.toBusinessDTO(b);
            u.getBusinessOwned().add(bd);
            UserRepository.save(u);
            return true;
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }

    public boolean isOwner(String username, ObjectId bid){
        User u = UserRepository.findByUsername(username);
        if(u == null) return false;
        return u.getBusinessOwned().stream()
                .anyMatch(
                        b ->
                                b.getId().equals(
                                        bid.toHexString()));
    }


    public List<Business> getAll(){
        return BusinessRepository.findAll();
    }

    public Business getById(ObjectId id) {
        return BusinessRepository.findById(id).orElse(null);
    }

    public void deleteBusiness(ObjectId id){
        Business b=BusinessRepository.findById(id).orElse(null);
        User u=UserRepository.findByUsername(b.getOwner());
        List<BusinessSummaryDTO> bd=u.getBusinessOwned();
        boolean remove=bd.removeIf(i -> i.getId().equals(id.toHexString()));
        List<ProductSummaryDTO> products = b.getProducts();
        if (products != null) {
            for(ProductSummaryDTO dto : products){
                Product product = getProductFromDTO(dto);
                if(product != null) {
                    ProductRepository.delete(product);
                } else {
                    System.out.println("Product not found: " + dto.getP_id());
                }
            }
        }
        UserRepository.save(u);
        BusinessRepository.delete(b);
    }


    public void deleteBusiness(ObjectId id, String username) {
        Business b = BusinessRepository.findById(id).orElse(null);
        if (b == null) return;

        User u = UserRepository.findByUsername(username);
        if (u == null) return;

        // Remove business from user's list
        u.getBusinessOwned().removeIf(bus -> bus.getId().equals(id.toHexString()));

        // Delete associated products
        List<ProductSummaryDTO> products = b.getProducts(); // DTOs
        if (products != null) {
            for (ProductSummaryDTO dto : products) {
                Product productEntity =getProductFromDTO(dto); // convert each DTO to entity
                ProductRepository.delete(productEntity); // delete entity
            }
        }

        // Save user and delete business
        UserRepository.save(u);
        BusinessRepository.delete(b);
    }



    public List<BusinessSummaryDTO> getFor(String currentUsername) {
            User u=UserRepository.findByUsername(currentUsername);
            List<BusinessSummaryDTO> b=u.getBusinessOwned();
            if(b==null) throw new NullPointerException();
            return b;
    }

    public Business getBusinessFromDTO(BusinessSummaryDTO dto) {
        ObjectId id = new ObjectId(dto.getId());
        return BusinessRepository.findById(id).orElse(null);
    }

    public Product getProductFromDTO(ProductSummaryDTO dto) {
        ObjectId id = new ObjectId(dto.getP_id());
        return ProductRepository.findById(id).orElse(null);
    }

    public BusinessPublicDTO publicBusiness(ObjectId bId) throws Exception {
        Business b=getById(bId);
        if(b==null) throw new NullPointerException();
        return DTOServices.businessPublicDTO(b);
    }
}
