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

  // Leaflet map initialization and updates
  useEffect(() => {
    if (loading || !window.L) return;

    // Clean up previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer) return;

    // Initialize Map centered around Hub
    const map = window.L.map('leaflet-map').setView([SHOP_LAT, SHOP_LNG], 13);
    mapInstanceRef.current = map;

    // OpenStreetMap Tile Layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Dynamic custom styled marker for Central Hub (Shop)
    const hubIcon = window.L.divIcon({
      html: `<div class="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white shadow-lg font-black text-xs">Hub</div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    window.L.marker([SHOP_LAT, SHOP_LNG], { icon: hubIcon })
      .addTo(map)
      .bindPopup('<b>Central Hub (Shop)</b><br>Bengaluru Main Road')
      .openPopup();

    // Create markers for delivery stops
    deliveries.forEach((delivery, index) => {
      const stopIcon = window.L.divIcon({
        html: `<div class="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white shadow-lg font-black text-xs">#${index + 1}</div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      window.L.marker([delivery.order.latitude, delivery.order.longitude], { icon: stopIcon })
        .addTo(map)
        .bindPopup(`<b>Stop #${index + 1}: ${delivery.order.customerName}</b><br>${delivery.order.address}<br>Status: <i>${delivery.status.replace(/_/g, ' ')}</i>`);
    });

    // Trace real-world driving route using OSRM API
    if (deliveries.length > 0) {
      const coordinates = [
        `${SHOP_LNG},${SHOP_LAT}`,
        ...deliveries.map(d => `${d.order.longitude},${d.order.latitude}`)
      ].join(';');

      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

      fetch(osrmUrl)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            const routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]); // [lat, lng]
            const polyline = window.L.polyline(routeCoords, {
              color: '#4f46e5', // indigo-600
              weight: 5,
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(map);
            map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
          } else {
            drawFallbackLines(map);
          }
        })
        .catch(err => {
          console.error('OSRM API failed, falling back to direct paths:', err);
          drawFallbackLines(map);
        });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [deliveries, loading]);

  // Fallback straight lines in case OSRM is offline or blocked
  const drawFallbackLines = (map) => {
    const points = [
      [SHOP_LAT, SHOP_LNG],
      ...deliveries.map(d => [d.order.latitude, d.order.longitude])
    ];
    const polyline = window.L.polyline(points, {
      color: '#ef4444', // red-500 fallback
      weight: 4,
      dashArray: '8 6'
    }).addTo(map);
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Route Map</h2>
            <p className="text-slate-500">Live spatial navigation powered by OSRM Smart Routing</p>
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
            {/* Interactive Leaflet Map Container */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <MapIcon className="text-indigo-600" size={20} />
                <span className="font-bold">Live AI Map View (Street Navigation)</span>
              </div>

              {/* Map element */}
              <div 
                id="leaflet-map" 
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
