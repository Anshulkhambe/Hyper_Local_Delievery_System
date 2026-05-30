package com.hlmd.fleetopt.repository;

import com.hlmd.fleetopt.entity.Delivery;
import com.hlmd.fleetopt.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByAgentId(Long agentId);
    List<Delivery> findByStatus(OrderStatus status);
    java.util.Optional<Delivery> findByOrderId(Long orderId);
}
