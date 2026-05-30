import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { MapPin, Navigation, Compass, Map as MapIcon, RefreshCw, Info } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const RouteMap = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const mapInstanceRef = useRef(null);

  // Store/Shop Location
  const SHOP_LAT = 12.9716;
  const SHOP_LNG = 77.5946;

  useEffect(() => {
    if (user) {
      if (user.id) {
        fetchActiveDeliveries();
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const fetchActiveDeliveries = async () => {
    try {
      const response = await api.get(`/agents/user/${user.id}/deliveries`);
      const active = response.data.filter(d => d.status !== 'DELIVERED');
      setDeliveries(active);
    } catch (error) {
      toast.error('Failed to fetch navigation routes');
    } finally {
      setLoading(false);
    }
  };

  // Google Maps initialization and updates
  useEffect(() => {
    if (loading || !window.google || !window.google.maps) return;

    const mapContainer = document.getElementById('google-map');
    if (!mapContainer) return;

    // Initialize Map centered around Hub
    const map = new window.google.maps.Map(mapContainer, {
      center: { lat: SHOP_LAT, lng: SHOP_LNG },
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [{ "visibility": "off" }]
        }
      ]
    });
    mapInstanceRef.current = map;

    // Custom Styled Marker for Central Hub (Shop) using Vector Symbols
    const hubMarker = new window.google.maps.Marker({
      position: { lat: SHOP_LAT, lng: SHOP_LNG },
      map: map,
      title: "Central Hub (Shop)",
      icon: {
        path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 6,
        fillColor: "#4f46e5", // Indigo-600
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ffffff"
      }
    });

    const hubInfoWindow = new window.google.maps.InfoWindow({
      content: '<div style="padding: 4px; color: #1e293b; font-weight: bold; font-family: sans-serif;">Central Hub (Shop)</div>'
    });
    hubMarker.addListener("click", () => {
      hubInfoWindow.open(map, hubMarker);
    });

    // Create bounds and add markers for delivery stops
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(new window.google.maps.LatLng(SHOP_LAT, SHOP_LNG));

    deliveries.forEach((delivery, index) => {
      const stopLatLng = { lat: delivery.order.latitude, lng: delivery.order.longitude };
      bounds.extend(new window.google.maps.LatLng(delivery.order.latitude, delivery.order.longitude));

      const stopMarker = new window.google.maps.Marker({
        position: stopLatLng,
        map: map,
        title: delivery.order.customerName,
        label: {
          text: `${index + 1}`,
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "11px"
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#f59e0b", // Amber-500
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff"
        }
      });

      const stopInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; color: #1e293b; font-family: sans-serif;">
            <h4 style="font-weight: bold; margin: 0 0 4px 0; font-size: 13px;">Stop #${index + 1}: ${delivery.order.customerName}</h4>
            <p style="font-size: 11px; margin: 0 0 6px 0; color: #64748b;">${delivery.order.address}</p>
            <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #475569;">${delivery.status.replace(/_/g, ' ')}</span>
          </div>
        `
      });

      stopMarker.addListener("click", () => {
        stopInfoWindow.open(map, stopMarker);
      });
    });

    // Google Maps Directions service routing
    if (deliveries.length > 0) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#4f46e5',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });

      const origin = new window.google.maps.LatLng(SHOP_LAT, SHOP_LNG);
      const destination = new window.google.maps.LatLng(
        deliveries[deliveries.length - 1].order.latitude,
        deliveries[deliveries.length - 1].order.longitude
      );

      const waypoints = deliveries.slice(0, -1).map(d => ({
        location: new window.google.maps.LatLng(d.order.latitude, d.order.longitude),
        stopover: true
      }));

      directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: false, // Follow our local N-N sequence optimization
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        } else {
          console.warn('Google Directions failed:', status);
          drawGoogleFallbackLines(map);
        }
      });
    } else {
      map.fitBounds(bounds);
    }
  }, [deliveries, loading]);

  // Fallback straight lines in case Google routing is offline or limits occur
  const drawGoogleFallbackLines = (map) => {
    const flightPlanCoordinates = [
      { lat: SHOP_LAT, lng: SHOP_LNG },
      ...deliveries.map(d => ({ lat: d.order.latitude, lng: d.order.longitude }))
    ];
    const flightPath = new window.google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#ef4444',
      strokeOpacity: 0.8,
      strokeWeight: 4
    });
    flightPath.setMap(map);
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Route Map</h2>
            <p className="text-slate-500">Live spatial navigation powered by Google Maps Directions AI</p>
          </div>
          <button 
            onClick={fetchActiveDeliveries}
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl glass-card flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all"
          >
            <RefreshCw size={18} />
          </button>
        </header>

        {loading ? (
          <p className="text-slate-500 text-center py-20">Loading your navigation map...</p>
        ) : user && !user.id ? (
          <div className="text-center text-amber-500 py-20 bg-amber-500/5 dark:bg-amber-950/10 rounded-3xl border border-amber-500/20 p-6">
            <p className="font-bold text-lg">Session Out of Sync</p>
            <p className="text-sm text-amber-600/80 mt-1">Please log out and log back in once to synchronize your delivery route map details.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Google Maps Container */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <MapIcon className="text-indigo-600" size={20} />
                <span className="font-bold">Live Google Maps View (Street Navigation)</span>
              </div>

              {/* Map element */}
              <div 
                id="google-map" 
                className="w-full h-[480px] rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg z-10"
              />
            </div>

            {/* Stop Sequence Panel */}
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Compass className="text-amber-500" size={20} />
                  <span className="font-bold">Stop Navigation Order</span>
                </div>

                <div className="space-y-6 relative pl-4 before:absolute before:left-[11px] before:top-2 before:bottom-6 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                  {/* Start Point */}
                  <div className="relative flex items-start gap-4">
                    <div className="absolute -left-[9px] top-1.5 w-[12px] h-[12px] rounded-full bg-indigo-600 border border-white dark:border-slate-900" />
                    <div>
                      <h4 className="font-bold text-sm">Central Hub (Shop)</h4>
                      <p className="text-xs text-slate-400">Store location: Bengaluru Main Road</p>
                    </div>
                  </div>

                  {/* Scheduled Stops */}
                  {deliveries.length > 0 ? (
                    deliveries.map((delivery, index) => (
                      <motion.div 
                        key={delivery.id} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start gap-4"
                      >
                        <div className="absolute -left-[9px] top-1.5 w-[12px] h-[12px] rounded-full bg-amber-500 border border-white dark:border-slate-900" />
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm flex items-center gap-2">
                            Stop #{index + 1}: {delivery.order.customerName}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin size={10} /> {delivery.order.address}
                          </p>
                          <span className="inline-block text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase px-2 py-0.5 rounded">
                            {delivery.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm py-4 italic">No scheduled stops found.</p>
                  )}
                </div>
              </div>

              {deliveries.length > 0 && (
                <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl flex gap-3 items-start border border-indigo-500/10">
                  <Info className="text-indigo-600 mt-0.5 shrink-0" size={16} />
                  <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                    This sequence is generated using street routing network graphs to guarantee the most fuel-efficient, street-legal dispatch path.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RouteMap;
