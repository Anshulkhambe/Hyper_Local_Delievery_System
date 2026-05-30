package com.hlmd.fleetopt.repository;

import com.hlmd.fleetopt.entity.DeliveryAgent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryAgentRepository extends JpaRepository<DeliveryAgent, Long> {
    List<DeliveryAgent> findByIsAvailable(Boolean isAvailable);
    Optional<DeliveryAgent> findByUserId(Integer userId);
}
