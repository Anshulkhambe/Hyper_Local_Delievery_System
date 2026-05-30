package com.hlmd.fleetopt.dto;

import com.hlmd.fleetopt.entity.DeliveryAgent;
import com.hlmd.fleetopt.entity.Order;
import java.util.List;

public class DashboardStatsDTO {
    private long totalOrders;
    private long pendingOrders;
    private long deliveredOrders;
    private long activeAgents;
    private double revenue;
    private List<Order> recentDeliveries;
    private List<DeliveryAgent> liveAgents;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long totalOrders, long pendingOrders, long deliveredOrders, long activeAgents, double revenue, List<Order> recentDeliveries, List<DeliveryAgent> liveAgents) {
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.deliveredOrders = deliveredOrders;
        this.activeAgents = activeAgents;
        this.revenue = revenue;
        this.recentDeliveries = recentDeliveries;
        this.liveAgents = liveAgents;
    }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getDeliveredOrders() { return deliveredOrders; }
    public void setDeliveredOrders(long deliveredOrders) { this.deliveredOrders = deliveredOrders; }

    public long getActiveAgents() { return activeAgents; }
    public void setActiveAgents(long activeAgents) { this.activeAgents = activeAgents; }

    public double getRevenue() { return revenue; }
    public void setRevenue(double revenue) { this.revenue = revenue; }

    public List<Order> getRecentDeliveries() { return recentDeliveries; }
    public void setRecentDeliveries(List<Order> recentDeliveries) { this.recentDeliveries = recentDeliveries; }

    public List<DeliveryAgent> getLiveAgents() { return liveAgents; }
    public void setLiveAgents(List<DeliveryAgent> liveAgents) { this.liveAgents = liveAgents; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalOrders;
        private long pendingOrders;
        private long deliveredOrders;
        private long activeAgents;
        private double revenue;
        private List<Order> recentDeliveries;
        private List<DeliveryAgent> liveAgents;

        public Builder totalOrders(long totalOrders) { this.totalOrders = totalOrders; return this; }
        public Builder pendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; return this; }
        public Builder deliveredOrders(long deliveredOrders) { this.deliveredOrders = deliveredOrders; return this; }
        public Builder activeAgents(long activeAgents) { this.activeAgents = activeAgents; return this; }
        public Builder revenue(double revenue) { this.revenue = revenue; return this; }
        public Builder recentDeliveries(List<Order> recentDeliveries) { this.recentDeliveries = recentDeliveries; return this; }
        public Builder liveAgents(List<DeliveryAgent> liveAgents) { this.liveAgents = liveAgents; return this; }

        public DashboardStatsDTO build() {
            return new DashboardStatsDTO(totalOrders, pendingOrders, deliveredOrders, activeAgents, revenue, recentDeliveries, liveAgents);
        }
    }
}
