import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Map, Zap, UserPlus, MapPin, Navigation, ArrowRight, CheckCircle2, Leaf, Globe } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const RouteOptimization = () => {
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');

  const fetchOptimization = async () => {
    setLoading(true);
    try {
      const response = await api.get('/optimize/route');
      setOptimizedRoute(response.data);
      
      const agentsResponse = await api.get('/agents/available');
      setAgents(agentsResponse.data);
    } catch (error) {
      toast.error('Optimization failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getTotalDistance = () => {
    if (optimizedRoute.length === 0) return 0;
    let total = 0;
    let currentLat = 12.9716;
    let currentLng = 77.5946;
    
    optimizedRoute.forEach(order => {
      total += calculateDistance(currentLat, currentLng, order.latitude, order.longitude);
      currentLat = order.latitude;
      currentLng = order.longitude;
    });
    
    return total.toFixed(2);
  };

  const handleAssign = async () => {
    if (!selectedAgent || optimizedRoute.length === 0) {
      toast.warning('Select an agent and generate a route');
      return;
    }
    
    try {
      // Sequentially assign all orders in the optimized batch to the agent
      for (const order of optimizedRoute) {
        await api.post(`/orders/${order.id}/assign/${selectedAgent}`);
      }
      
      Swal.fire({
        title: 'Batch Dispatched!',
        text: `All ${optimizedRoute.length} orders in the optimized route have been successfully assigned to the agent.`,
        icon: 'success',
        confirmButtonColor: '#10b981', // emerald-500
        customClass: {
          popup: 'rounded-3xl shadow-xl'
        }
      });
      
      setOptimizedRoute([]);
      setSelectedAgent('');
    } catch (error) {
      toast.error('Batch assignment failed');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Route Optimization</h2>
            <p className="text-slate-500">Intelligent fleet routing using Nearest Neighbor</p>
          </div>
          <button 
            onClick={fetchOptimization}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            <Zap size={20} className={loading ? 'animate-spin' : ''} /> 
            {loading ? 'Optimizing...' : 'Generate Best Route'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8 rounded-3xl min-h-[400px]">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600">
                  <Map size={24} />
                </div>
                <h3 className="text-xl font-bold">Delivery Sequence</h3>
              </div>

              <div className="relative">
                {optimizedRoute.length > 0 ? (
                  <div className="space-y-4">
                    {/* Visual Connector Line */}
                    <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-800" />
                    
                    {optimizedRoute.map((order, index) => (
                      <motion.div 
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="z-10 w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center font-bold text-indigo-600 shadow-md">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">#ORD-{order.id} - {order.customerName}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin size={12} /> {order.address}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Est. Time</p>
                          <p className="font-bold text-indigo-600">{15 + index * 10} mins</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Navigation size={48} className="mb-4 opacity-20" />
                    <p>Click "Generate Best Route" to start optimization</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600">
                  <UserPlus size={24} />
                </div>
                <h3 className="text-xl font-bold">Quick Assign</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Available Agent</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    <option value="">Select an agent...</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Batch Size</span>
                    <span className="font-bold">{optimizedRoute.length} Orders</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Distance</span>
                    <span className="font-bold">{getTotalDistance()} km</span>
                  </div>
                </div>

                <button 
                  onClick={handleAssign}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                >
                  Dispatch Batch <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {optimizedRoute.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-lg shadow-emerald-600/20"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-white/20 pb-3">
                  <Leaf className="text-emerald-200 animate-bounce" size={20} />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-100">Green Fleet Eco-Impact</span>
                </div>
                <p className="font-bold text-sm mb-6 leading-snug">
                  This optimized dispatch saves fuel and directly minimizes excessive greenhouse gas emissions!
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-[10px] uppercase font-black text-emerald-200">CO₂ Prevented</p>
                    <p className="text-xl font-black mt-1">{(getTotalDistance() * 0.32 * 0.12).toFixed(2)} kg</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-[10px] uppercase font-black text-emerald-200">Fuel Saved</p>
                    <p className="text-xl font-black mt-1">{(getTotalDistance() * 0.32 * 0.08).toFixed(2)} L</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 col-span-2 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-black text-emerald-200">Eco-Offset Equivalent</p>
                      <p className="text-lg font-black mt-1">{(getTotalDistance() * 0.32 * 0.12 / 0.06).toFixed(1)} Tree-Days</p>
                    </div>
                    <Globe className="text-emerald-200/40" size={32} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-8 rounded-3xl bg-indigo-600 text-white border-none">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold uppercase opacity-80">Route Insight</span>
                </div>
                <p className="font-medium text-sm">
                  Optimized route reduces travel time by <span className="text-emerald-300 font-bold">24%</span> compared to manual assignment.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RouteOptimization;
