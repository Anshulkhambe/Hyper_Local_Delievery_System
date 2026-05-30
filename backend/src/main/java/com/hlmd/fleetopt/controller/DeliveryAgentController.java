package com.hlmd.fleetopt.controller;

import com.hlmd.fleetopt.entity.Delivery;
import com.hlmd.fleetopt.entity.DeliveryAgent;
import com.hlmd.fleetopt.repository.DeliveryAgentRepository;
import com.hlmd.fleetopt.repository.DeliveryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/agents")
public class DeliveryAgentController {

    private final DeliveryAgentRepository repository;
    private final DeliveryRepository deliveryRepository;

    public DeliveryAgentController(DeliveryAgentRepository repository, DeliveryRepository deliveryRepository) {
        this.repository = repository;
        this.deliveryRepository = deliveryRepository;
    }

    @GetMapping
    public ResponseEntity<List<DeliveryAgent>> getAllAgents() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/available")
    public ResponseEntity<List<DeliveryAgent>> getAvailableAgents() {
        return ResponseEntity.ok(repository.findByIsAvailable(true));
    }

    @PatchMapping("/{agentId}/availability")
    public ResponseEntity<DeliveryAgent> updateAvailability(
            @PathVariable Long agentId,
            @RequestParam Boolean available
    ) {
        DeliveryAgent agent = repository.findById(agentId).orElseThrow();
        agent.setIsAvailable(available);
        return ResponseEntity.ok(repository.save(agent));
    }

    @GetMapping("/user/{userId}/deliveries")
    public ResponseEntity<List<Delivery>> getAgentDeliveries(@PathVariable Integer userId) {
        DeliveryAgent agent = repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Delivery Agent profile not found for user ID: " + userId));
        return ResponseEntity.ok(deliveryRepository.findByAgentId(agent.getId()));
    }

    @GetMapping("/{agentId}/deliveries")
    public ResponseEntity<List<Delivery>> getAgentDeliveriesById(@PathVariable Long agentId) {
        return ResponseEntity.ok(deliveryRepository.findByAgentId(agentId));
    }
}
