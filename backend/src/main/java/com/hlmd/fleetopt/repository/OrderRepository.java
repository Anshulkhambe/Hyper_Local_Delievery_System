package com.hlmd.fleetopt.repository;

import com.hlmd.fleetopt.entity.Order;
import com.hlmd.fleetopt.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(OrderStatus status);
    long countByStatus(OrderStatus status);
    List<Order> findTop5ByStatusOrderByUpdatedAtDesc(OrderStatus status);
}
