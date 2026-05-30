package com.hlmd.fleetopt.service;

import com.hlmd.fleetopt.entity.Delivery;
import com.hlmd.fleetopt.entity.DeliveryAgent;
import com.hlmd.fleetopt.entity.Order;
import com.hlmd.fleetopt.entity.OrderStatus;
import com.hlmd.fleetopt.repository.DeliveryAgentRepository;
import com.hlmd.fleetopt.repository.DeliveryRepository;
import com.hlmd.fleetopt.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final DeliveryRepository deliveryRepository;
    private final DeliveryAgentRepository agentRepository;

    public OrderService(
            OrderRepository orderRepository,
            DeliveryRepository deliveryRepository,
            DeliveryAgentRepository agentRepository
    ) {
        this.orderRepository = orderRepository;
        this.deliveryRepository = deliveryRepository;
        this.agentRepository = agentRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(Order order) {
        order.setStatus(OrderStatus.PENDING);
        return orderRepository.save(order);
    }

    @Transactional
    public Delivery assignOrder(Long orderId, Long agentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        DeliveryAgent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        order.setStatus(OrderStatus.ASSIGNED);
        orderRepository.save(order);

        Delivery delivery = Delivery.builder()
                .order(order)
                .agent(agent)
                .status(OrderStatus.ASSIGNED)
                .build();

        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        
        // Update associated delivery if exists
        deliveryRepository.findByOrderId(orderId).ifPresent(delivery -> {
            delivery.setStatus(status);
            if (status == OrderStatus.DELIVERED) {
                delivery.setDeliveredAt(LocalDateTime.now());
            }
            deliveryRepository.save(delivery);
        });
        
        return orderRepository.save(order);
    }
}
