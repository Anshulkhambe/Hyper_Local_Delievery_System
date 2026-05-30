package com.hlmd.fleetopt.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "agent_id", referencedColumnName = "id")
    private DeliveryAgent agent;

    @CreationTimestamp
    private LocalDateTime assignedAt;

    private LocalDateTime deliveredAt;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.ASSIGNED;

    public Delivery() {}

    public Delivery(Long id, Order order, DeliveryAgent agent, LocalDateTime assignedAt, LocalDateTime deliveredAt, OrderStatus status) {
        this.id = id;
        this.order = order;
        this.agent = agent;
        this.assignedAt = assignedAt;
        this.deliveredAt = deliveredAt;
        this.status = status != null ? status : OrderStatus.ASSIGNED;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public DeliveryAgent getAgent() { return agent; }
    public void setAgent(DeliveryAgent agent) { this.agent = agent; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Order order;
        private DeliveryAgent agent;
        private LocalDateTime assignedAt;
        private LocalDateTime deliveredAt;
        private OrderStatus status = OrderStatus.ASSIGNED;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder order(Order order) { this.order = order; return this; }
        public Builder agent(DeliveryAgent agent) { this.agent = agent; return this; }
        public Builder assignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; return this; }
        public Builder deliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; return this; }
        public Builder status(OrderStatus status) { this.status = status; return this; }

        public Delivery build() {
            return new Delivery(id, order, agent, assignedAt, deliveredAt, status);
        }
    }
}
