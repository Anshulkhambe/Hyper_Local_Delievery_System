package com.hlmd.fleetopt.service;

import com.hlmd.fleetopt.dto.DashboardStatsDTO;
import com.hlmd.fleetopt.entity.Order;
import com.hlmd.fleetopt.entity.OrderStatus;
import com.hlmd.fleetopt.repository.DeliveryAgentRepository;
import com.hlmd.fleetopt.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;
    private final DeliveryAgentRepository agentRepository;

    public DashboardService(OrderRepository orderRepository, DeliveryAgentRepository agentRepository) {
        this.orderRepository = orderRepository;
        this.agentRepository = agentRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long activeAgents = agentRepository.count(); // All agents for now, or those with specific status
        
        double revenue = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() == OrderStatus.DELIVERED)
                .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                .sum();

        List<Order> recentDeliveries = orderRepository.findTop5ByStatusOrderByUpdatedAtDesc(OrderStatus.DELIVERED);
        
        return DashboardStatsDTO.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .deliveredOrders(deliveredOrders)
                .activeAgents(activeAgents)
                .revenue(revenue)
                .recentDeliveries(recentDeliveries)
                .liveAgents(agentRepository.findAll()) // Fetch all agents for live status
                .build();
    }
}
