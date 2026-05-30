package com.hlmd.fleetopt.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_agents")
public class DeliveryAgent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String name;
    private String phone;
    
    private Boolean isAvailable = true;

    private Double currentLat;
    private Double currentLng;

    public DeliveryAgent() {}

    public DeliveryAgent(Long id, User user, String name, String phone, Boolean isAvailable, Double currentLat, Double currentLng) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.phone = phone;
        this.isAvailable = isAvailable != null ? isAvailable : true;
        this.currentLat = currentLat;
        this.currentLng = currentLng;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Double getCurrentLat() { return currentLat; }
    public void setCurrentLat(Double currentLat) { this.currentLat = currentLat; }

    public Double getCurrentLng() { return currentLng; }
    public void setCurrentLng(Double currentLng) { this.currentLng = currentLng; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private String name;
        private String phone;
        private Boolean isAvailable = true;
        private Double currentLat;
        private Double currentLng;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder isAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public Builder currentLat(Double currentLat) { this.currentLat = currentLat; return this; }
        public Builder currentLng(Double currentLng) { this.currentLng = currentLng; return this; }

        public DeliveryAgent build() {
            return new DeliveryAgent(id, user, name, phone, isAvailable, currentLat, currentLng);
        }
    }
}
