package com.arogyavatika.ecommerce.services;

import com.arogyavatika.ecommerce.dto.OrderDTO;
import com.arogyavatika.ecommerce.dto.ProductSummaryDTO;
import com.arogyavatika.ecommerce.entities.Business;
import com.arogyavatika.ecommerce.entities.Order;
import com.arogyavatika.ecommerce.entities.Product;
import com.arogyavatika.ecommerce.entities.User;
import com.arogyavatika.ecommerce.repository.OrderRepository;
import com.arogyavatika.ecommerce.repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class OrderServices {

    @Autowired
    private OrderRepository OrderRepository;
    @Autowired
    private ProductServices ProductServices;
    @Autowired
    private  UserRepository UserRepository;
    @Autowired
    private BusinessServices BusinessServices;
    @Autowired
    private DTOServices Dto;

    public List<OrderDTO> getAll() {
        return OrderRepository.findAll()
                .stream()
                .map(Dto::toOrderDTO)
                .collect(Collectors.toList());
    }

    public List<Order> getAllO() {
        return OrderRepository.findAll();
    }

    public Order getById(ObjectId id){
        return OrderRepository.findById(id).orElse(null);
    }

    @Transactional
    public boolean saveOrder(String username, String pId, String bId, String address, int orderQuantity) {
        try {
            // Fetch user
            User user = UserRepository.findByUsername(username);
            if (user == null) throw new NoSuchElementException("User not found");

            // Fetch product
            ObjectId productId = new ObjectId(pId);
            Product product = ProductServices.getById(productId);
            if (product == null) throw new NoSuchElementException("Product not found");

            // Fetch business from product
            ObjectId businessId = new ObjectId(bId);
            Business business = BusinessServices.getById(businessId);
            if (business == null) throw new NoSuchElementException("Business not found");

            // Check quantity
            if (orderQuantity > product.getQuantity())
                throw new IllegalArgumentException("Requested quantity exceeds available stock");

            // Reduce product stock
            product.setQuantity(product.getQuantity() - orderQuantity);

            // Create order
            Order order = new Order();
            order.setOrderBy(user);
            order.setOrderProduct(product);
            order.setOrderOwns(business);
            order.setO_quantity(orderQuantity);
            order.setAddress(address);
            order.setPaymentdone(false);

            // Save order
            OrderRepository.save(order);

            // Convert to DTO
            OrderDTO orderDTO = Dto.toOrderDTO(order);

            // Update references
            user.getOrderPlace().add(orderDTO);
            business.getOrders().add(orderDTO);

            // Save updates
            ProductServices.saveProduct(product);
            BusinessServices.save(business);
            UserRepository.save(user);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    public boolean AddeleteOrder(ObjectId id) {
        try {
            OrderRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public boolean deleteOrder(ObjectId id, String username) throws Exception {
        User u = UserRepository.findByUsername(username);
        if (u == null) throw new NoSuchElementException("User not found");

        Order or = OrderRepository.findById(id).orElse(null);
        if (or == null) throw new NoSuchElementException("Order not found");

        Product p = or.getOrderProduct();
        if (p == null) throw new NoSuchElementException("Product in order not found");

        // Restock product
        p.setQuantity(p.getQuantity() + or.getO_quantity());

        List<ProductSummaryDTO> pu = u.getAddToCart() != null ? u.getAddToCart() : new ArrayList<>();
        pu.forEach(i -> {
            if (i.getP_id().equals(p.getP_id().toHexString())) {
                i.setQuantity(i.getQuantity() + or.getO_quantity());
            }
        });

        Business b = or.getOrderOwns();
        if (b == null) throw new NullPointerException("Order does not belong to any business");

        List<ProductSummaryDTO> pb = b.getProducts() != null ? b.getProducts() : new ArrayList<>();
        pb.forEach(i -> {
            if (i.getP_id().equals(p.getP_id().toHexString())) {
                i.setQuantity(i.getQuantity() + or.getO_quantity());
            }
        });

        List<OrderDTO> businessOrders = b.getOrders() != null ? b.getOrders() : new ArrayList<>();
        List<OrderDTO> userOrders = u.getOrderPlace() != null ? u.getOrderPlace() : new ArrayList<>();

        boolean removedFromBusiness = businessOrders.removeIf(i -> i.getO_id().equals(id.toHexString()));
        boolean removedFromUser = userOrders.removeIf(i -> i.getO_id().equals(id.toHexString()));

        if (!removedFromBusiness && !removedFromUser) return false;

        BusinessServices.save(b);
        UserRepository.save(u);
        ProductServices.saveProduct(p);
        OrderRepository.deleteById(id);

        return true;
    }




    public Order getOrderFromDTO(OrderDTO dto) {
        ObjectId id = new ObjectId(dto.getO_id());
        return OrderRepository.findById(id).orElse(null);
    }

    public void confirmPay(ObjectId oId) throws Exception{
        Order o=getById(oId);
        o.setPaymentdone(true);
        Business b=o.getOrderOwns();
        List<OrderDTO> od=b.getOrders();
        od.forEach( i -> {
                if(i.getO_id().equals(oId.toHexString())){
                    i.setPay(true);
                    }
                });
        User u=o.getOrderBy();
        List<OrderDTO> op=u.getOrderPlace();
        op.forEach(i->{
            if(i.getO_id().equals(oId.toHexString())){
                i.setPay(true);
            }
        });
        BusinessServices.save(b);
        UserRepository.save(u);
    }

    public void deleteBusinessOrder(String oId, ObjectId bId) throws Exception {
        Business b=BusinessServices.getById(bId);
        List<OrderDTO> o=b.getOrders();
        boolean r=o.removeIf(i -> i.getO_id().equals(oId));
        BusinessServices.save(b);
    }

    public void deleteUserOrder(String oId, String user) throws Exception {
        User u=UserRepository.findByUsername(user);
        List<OrderDTO> o=u.getOrderPlace();
        boolean r=o.removeIf(i -> i.getO_id().equals(oId));
        UserRepository.save(u);
    }
}
