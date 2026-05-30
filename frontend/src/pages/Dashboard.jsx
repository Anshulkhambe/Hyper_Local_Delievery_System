import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Truck, 
  DollarSign, 
  TrendingUp,
  MapPin
} from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    activeAgents: 0,
    revenue: 0,
    recentDeliveries: [],
    liveAgents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Analytics Overview</h2>
            <p className="text-slate-500">Welcome back to your delivery hub</p>
          </div>
          <div className="flex gap-4">
            <button className="glass-card px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              <Clock size={18} /> Last 7 Days
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders} 
            icon={ShoppingBag} 
            color="bg-blue-500" 
            delay={0.1}
          />
          <StatCard 
            title="Pending" 
            value={stats.pendingOrders} 
            icon={Clock} 
            color="bg-amber-500" 
            delay={0.2}
          />
          <StatCard 
            title="Delivered" 
            value={stats.deliveredOrders} 
            icon={CheckCircle} 
            color="bg-emerald-500" 
            delay={0.3}
          />
          <StatCard 
            title="Revenue" 
            value={`₹${stats.revenue}`} 
            icon={DollarSign} 
            color="bg-purple-500" 
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Recent Deliveries</h3>
              <TrendingUp className="text-emerald-500" />
            </div>
            <div className="space-y-4">
              {stats.recentDeliveries.length > 0 ? (
                stats.recentDeliveries.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Truck className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-bold">Order #{order.id}</p>
                        <p className="text-sm text-slate-500">Customer: {order.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold uppercase">
                        {order.status}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-4">No recent deliveries</p>
              )}
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6">Live Agents</h3>
            <div className="space-y-6">
              {stats.liveAgents.length > 0 ? (
                stats.liveAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${agent.id}`} alt="agent" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${agent.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{agent.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={10} /> {agent.isAvailable ? 'Online' : 'Offline'}
                      </p>
                    </div>
                    <button className="text-xs font-bold text-primary-600 hover:underline">Track</button>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-4">No agents active</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
