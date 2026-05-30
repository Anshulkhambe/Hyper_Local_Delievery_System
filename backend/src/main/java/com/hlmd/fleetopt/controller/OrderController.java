package com.hlmd.fleetopt.controller;

import com.hlmd.fleetopt.entity.Delivery;
import com.hlmd.fleetopt.entity.Order;
import com.hlmd.fleetopt.entity.OrderStatus;
import com.hlmd.fleetopt.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @PostMapping("/{orderId}/assign/{agentId}")
    public ResponseEntity<Delivery> assignOrder(
            @PathVariable Long orderId,
            @PathVariable Long agentId
    ) {
        return ResponseEntity.ok(orderService.assignOrder(orderId, agentId));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
