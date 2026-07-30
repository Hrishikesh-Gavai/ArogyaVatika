package com.arogyavatika.ecommerce.services;

import com.arogyavatika.ecommerce.dto.BusinessSummaryDTO;
import com.arogyavatika.ecommerce.dto.OrderDTO;
import com.arogyavatika.ecommerce.dto.ProductSummaryDTO;
import com.arogyavatika.ecommerce.entities.Business;
import com.arogyavatika.ecommerce.entities.Product;
import com.arogyavatika.ecommerce.entities.User;
import com.arogyavatika.ecommerce.repository.ProductRepository;
import com.arogyavatika.ecommerce.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ProductServices {

    @Autowired
    private ProductRepository ProductRepository;
    @Autowired
    private BusinessServices BusinessServices;
    @Autowired
    private UserRepository UserRepository;

    @Autowired
    private DTOServices DTOservices;

    public List<Product> getAll(){
        return ProductRepository.findAll();
    }

    public Product getById(ObjectId id){
        return ProductRepository.findById(id).orElse(null);
    }

    public boolean saveProduct(ObjectId b_id, Product p){
        try {
            Business b = BusinessServices.getById(b_id);
            if (b == null) {
                return false;
            }
            BusinessSummaryDTO bd=DTOservices.toBusinessDTO(b);
            p.setP_belongs(bd);
            p.setCreatedAt(LocalDateTime.now());
            p.setUpdatedAt(LocalDateTime.now());
            ProductRepository.save(p);
            ProductSummaryDTO pd=DTOservices.toProductDTO(p);
            b.getProducts().add(pd);
            BusinessServices.save(b);

            return true;
        } catch(Exception e) {
            e.printStackTrace(); // log error to see what’s failing
            return false;
        }
    }

    public boolean saveProduct(Product p){
        try {
            ProductRepository.save(p);
            return true;
        } catch(Exception e) {
            e.printStackTrace(); // log error to see what’s failing
            return false;
        }
    }

    public boolean deleteProduct(ObjectId id){
        try{
            Product p=getById(id);
            BusinessSummaryDTO bdto=p.getP_belongs();
            Business b=BusinessServices.getBusinessFromDTO(bdto);
            b.getProducts().removeIf(i-> i.getP_id().equals(id.toHexString()));
            ProductRepository.deleteById(id);
            BusinessServices.save(b);
            return true;
        }catch(Exception e){
            return false;
        }
    }

    public Object getProductForUser(String username) {
        try{
            User u= UserRepository.findByUsername(username);
            List<ProductSummaryDTO> res=u.getAddToCart();
            if(res==null) throw new NullPointerException();
            return res;
        }catch(Exception e){
            throw e;
        }
    }

    public boolean isOwner(String username, ObjectId pId) {
        Product p=ProductRepository.findById(pId).orElse(null);
        BusinessSummaryDTO b=p.getP_belongs();
        if(p==null || b==null) return false;
        return BusinessServices.isOwner(username,new ObjectId(b.getId()));
    }

    public List<Product> getProductForBusiness(ObjectId bId) throws Exception {
        Business b = BusinessServices.getById(bId);
        List<ProductSummaryDTO> pd = b.getProducts();
        if (pd == null) return Collections.emptyList(); // safer than NPE
        List<Product> products = new ArrayList<>();
        for (ProductSummaryDTO dto : pd) {
            if (dto.getP_id() != null && !dto.getP_id().isEmpty()) {
                products.add(getById(new ObjectId(dto.getP_id())));
            }
        }
        return products;
    }


    public void update(ObjectId pId, ProductSummaryDTO p) throws Exception {
        Product old = getById(pId);
        if (old == null) throw new NullPointerException("Product not found");

        // Update only non-null fields
        if (p.getQuantity() != 0) old.setQuantity(p.getQuantity());
        if (p.getAmt() != 0) old.setAmt(p.getAmt());
        if (p.getImg() != null && !p.getImg().isEmpty()) old.setImg(p.getImg());
        if (p.getCategories() != null && !p.getCategories().isEmpty()) old.setCategory(p.getCategories());
        if (p.getName() != null) old.setP_name(p.getName());

        old.setUpdatedAt(LocalDateTime.now());

        saveProduct(old);  // persist updated product

        // Update business reference if necessary
        BusinessSummaryDTO b = old.getP_belongs();
        if (b != null) {
            Business bb = BusinessServices.getById(new ObjectId(b.getId()));
            if (bb != null) {
                List<ProductSummaryDTO> products = bb.getProducts();
                products.removeIf(i -> i.getP_id().equals(pId.toString()));
                products.add(DTOservices.toProductDTO(old));
                BusinessServices.save(bb);
            }
        }
    }

}
