import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { MapPin, Navigation, Compass, Map as MapIcon, RefreshCw, Star, Info } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const RouteMap = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
      // Filter out completed deliveries for navigation view
      const active = response.data.filter(d => d.status !== 'DELIVERED');
      setDeliveries(active);
    } catch (error) {
      toast.error('Failed to fetch navigation routes');
    } finally {
      setLoading(false);
    }
  };

  // Convert GPS Coordinates to Relative SVG Canvas Pixels (centering around Bangalore center)
  const mapCoordinatesToPixels = (lat, lng) => {
    // Coordinate bounding box for Bangalore center local area
    const minLat = 12.9200;
    const maxLat = 12.9900;
    const minLng = 77.5800;
    const maxLng = 77.6500;

    const width = 600;
    const height = 450;

    // Linear projection/scaling
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    // SVG y-axis is inverted (0 is at top)
    const y = height - (((lat - minLat) / (maxLat - minLat)) * height);

    return { x, y };
  };

  const shopPixels = mapCoordinatesToPixels(SHOP_LAT, SHOP_LNG);

  // Generate optimal polyline SVG path string connecting Shop -> Stop 1 -> Stop 2 -> Stop 3...
  const getPolylinePathString = () => {
    if (deliveries.length === 0) return '';
    let path = `M ${shopPixels.x} ${shopPixels.y}`;
    deliveries.forEach(delivery => {
      const coords = mapCoordinatesToPixels(delivery.order.latitude, delivery.order.longitude);
      path += ` L ${coords.x} ${coords.y}`;
    });
    return path;
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Route Map</h2>
            <p className="text-slate-500">Visual navigation and sequence tracking</p>
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
            {/* SVG Map Canvas */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4 self-start">
                <MapIcon className="text-primary-600" size={20} />
                <span className="font-bold">Live Navigation Grid (Local Area)</span>
              </div>

              <div className="relative w-full max-w-[600px] h-[450px] bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
                {/* SVG Vector Layer */}
                <svg width="100%" height="100%" viewBox="0 0 600 450" className="absolute inset-0">
                  {/* Grid Lines for GPS Coordinate Look */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Traced Delivery Path Polyline */}
                  {deliveries.length > 0 && (
                    <motion.path
                      d={getPolylinePathString()}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3.5"
                      strokeDasharray="8 6"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  {/* Central Store/Shop Pin Pinpoint */}
                  <g className="cursor-pointer group">
                    <circle cx={shopPixels.x} cy={shopPixels.y} r="16" className="fill-primary-500/20 stroke-primary-500 stroke-[2] animate-ping" />
                    <circle cx={shopPixels.x} cy={shopPixels.y} r="10" className="fill-primary-600 stroke-white stroke-[2]" />
                    <text x={shopPixels.x} y={shopPixels.y - 16} textAnchor="middle" className="text-[10px] font-black fill-slate-800 dark:fill-slate-200 uppercase bg-white">Hub</text>
                  </g>

                  {/* Delivery Stop Pins Pinpoints */}
                  {deliveries.map((delivery, index) => {
                    const coords = mapCoordinatesToPixels(delivery.order.latitude, delivery.order.longitude);
                    return (
                      <g key={delivery.id} className="cursor-pointer group">
                        {/* Connecting Line from Previous Node */}
                        <circle cx={coords.x} cy={coords.y} r="14" className="fill-amber-500/10 stroke-amber-500/30 stroke-[1]" />
                        <circle cx={coords.x} cy={coords.y} r="8" className="fill-amber-500 stroke-white stroke-[1.5]" />
                        
                        {/* Stop Number Label */}
                        <rect x={coords.x - 10} y={coords.y - 28} width="20" height="14" rx="4" className="fill-slate-800 dark:fill-slate-100" />
                        <text x={coords.x} y={coords.y - 18} textAnchor="middle" className="text-[9px] font-bold fill-white dark:fill-slate-900">
                          #{index + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Local Area Floating Tags */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-slate-300 font-mono">
                  BANGALORE LOCAL CENTRAL HUB
                </div>
              </div>
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
                    <div className="absolute -left-[9px] top-1 w-[12px] h-[12px] rounded-full bg-primary-600 border border-white dark:border-slate-900" />
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
                <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-950/20 rounded-2xl flex gap-3 items-start border border-primary-500/10">
                  <Info className="text-primary-600 mt-0.5 shrink-0" size={16} />
                  <p className="text-xs text-primary-800 dark:text-primary-300 leading-relaxed">
                    This sequence is generated using the shop's local route optimizer to guarantee you take the most fuel-efficient path.
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
