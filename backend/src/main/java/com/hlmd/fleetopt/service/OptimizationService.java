package com.hlmd.fleetopt.service;

import com.hlmd.fleetopt.entity.Order;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OptimizationService {

    // Store/Shop Location (Default - should ideally be configurable)
    private static final double SHOP_LAT = 12.9716;
    private static final double SHOP_LNG = 77.5946;

    public List<Order> optimizeRoute(List<Order> orders) {
        if (orders == null || orders.isEmpty()) {
            return new ArrayList<>();
        }

        List<Order> unvisited = new ArrayList<>(orders);
        List<Order> optimizedPath = new ArrayList<>();

        double currentLat = SHOP_LAT;
        double currentLng = SHOP_LNG;

        while (!unvisited.isEmpty()) {
            Order closestOrder = null;
            double minDistance = Double.MAX_VALUE;

            for (Order order : unvisited) {
                double distance = calculateDistance(currentLat, currentLng, order.getLatitude(), order.getLongitude());
                if (distance < minDistance) {
                    minDistance = distance;
                    closestOrder = order;
                }
            }

            if (closestOrder != null) {
                optimizedPath.add(closestOrder);
                unvisited.remove(closestOrder);
                currentLat = closestOrder.getLatitude();
                currentLng = closestOrder.getLongitude();
            }
        }

        return optimizedPath;
    }

    /**
     * Haversine formula to calculate distance between two points in km.
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
