package com.hlmd.fleetopt.controller;

import com.hlmd.fleetopt.entity.Order;
import com.hlmd.fleetopt.entity.OrderStatus;
import com.hlmd.fleetopt.repository.OrderRepository;
import com.hlmd.fleetopt.service.OptimizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/optimize")
public class OptimizationController {

    private final OptimizationService optimizationService;
    private final OrderRepository orderRepository;

    public OptimizationController(OptimizationService optimizationService, OrderRepository orderRepository) {
        this.optimizationService = optimizationService;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/route")
    public ResponseEntity<List<Order>> getOptimizedRoute() {
        List<Order> pendingOrders = orderRepository.findByStatus(OrderStatus.PENDING);
        return ResponseEntity.ok(optimizationService.optimizeRoute(pendingOrders));
    }
}
