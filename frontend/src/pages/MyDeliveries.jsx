import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Truck, CheckCircle, Clock, MapPin, DollarSign, Calendar, Navigation } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.id) {
        fetchDeliveries();
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const fetchDeliveries = async () => {
    try {
      const response = await api.get(`/agents/user/${user.id}/deliveries`);
      setDeliveries(response.data);
    } catch (error) {
      toast.error('Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let nextStatus = '';
    let confirmText = '';
    
    if (currentStatus === 'ASSIGNED') {
      nextStatus = 'OUT_FOR_DELIVERY';
      confirmText = 'Mark as Out for Delivery?';
    } else if (currentStatus === 'OUT_FOR_DELIVERY') {
      nextStatus = 'DELIVERED';
      confirmText = 'Mark as Delivered?';
    } else {
      return; // Already delivered or other state
    }

    Swal.fire({
      title: confirmText,
      text: `Are you sure you want to update the status to ${nextStatus.replace(/_/g, ' ')}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, update!',
      customClass: {
        popup: 'rounded-3xl shadow-xl border border-slate-200/50'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/orders/${orderId}/status?status=${nextStatus}`);
          Swal.fire({
            title: 'Updated!',
            text: 'Delivery status updated successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup: 'rounded-3xl shadow-xl border border-slate-200/50'
            }
          });
          fetchDeliveries();
        } catch (error) {
          toast.error('Failed to update status');
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-500 text-white';
      case 'OUT_FOR_DELIVERY': return 'bg-purple-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle size={18} />;
      case 'OUT_FOR_DELIVERY': return <Truck size={18} />;
      default: return <Clock size={18} />;
    }
  };

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === 'ASSIGNED').length,
    transit: deliveries.filter(d => d.status === 'OUT_FOR_DELIVERY').length,
    completed: deliveries.filter(d => d.status === 'DELIVERED').length,
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10">
          <h2 className="text-3xl font-bold">My Deliveries</h2>
          <p className="text-slate-500">View and update your active delivery tasks</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Tasks', value: stats.total, color: 'from-blue-500 to-indigo-500' },
            { label: 'Assigned', value: stats.pending, color: 'from-amber-500 to-orange-500' },
            { label: 'In Transit', value: stats.transit, color: 'from-purple-500 to-pink-500' },
            { label: 'Completed', value: stats.completed, color: 'from-emerald-500 to-teal-500' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl glass-card flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="z-10">
                <span className="text-slate-400 text-sm font-bold uppercase">{item.label}</span>
                <h3 className="text-4xl font-extrabold mt-2">{item.value}</h3>
              </div>
              <div className={`absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 rounded-tl-full`} />
            </motion.div>
          ))}
        </div>

        {/* Deliveries List */}
        <h3 className="text-xl font-bold mb-6">Delivery Schedule</h3>
        <div className="space-y-6">
          {loading ? (
            <p className="text-slate-500 text-center py-10">Loading your schedule...</p>
          ) : user && !user.id ? (
            <div className="text-center text-amber-500 py-20 bg-amber-500/5 dark:bg-amber-950/10 rounded-3xl border border-amber-500/20 p-6">
              <p className="font-bold text-lg">Session Out of Sync</p>
              <p className="text-sm text-amber-600/80 mt-1">Please log out and log back in once to synchronize your delivery profile details.</p>
            </div>
          ) : deliveries.length > 0 ? (
            <AnimatePresence>
              {deliveries.map((delivery, index) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:scale-[1.01] transition-transform"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                      delivery.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary-500/10 text-primary-500'
                    }`}>
                      <Truck size={28} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg">Order #ORD-{delivery.order.id}</h4>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(delivery.status)}`}>
                          {getStatusIcon(delivery.status)} {delivery.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-slate-500 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-slate-400" />
                          <span>{delivery.order.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-slate-400" />
                          <span>Amount: <strong className="text-slate-800 dark:text-slate-200">₹{delivery.order.totalAmount}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-slate-400" />
                          <span>Assigned: {new Date(delivery.assignedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                        {delivery.deliveredAt && (
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={16} />
                            <span>Delivered: {new Date(delivery.deliveredAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {delivery.status !== 'DELIVERED' ? (
                      <button
                        onClick={() => handleUpdateStatus(delivery.order.id, delivery.status)}
                        className="w-full md:w-auto px-6 py-3.5 bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 active:scale-[0.98] transition-all shadow-lg shadow-primary-500/20"
                      >
                        <Navigation size={18} />
                        {delivery.status === 'ASSIGNED' ? 'Start Delivery' : 'Mark Delivered'}
                      </button>
                    ) : (
                      <div className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 select-none border border-transparent">
                        <CheckCircle size={18} />
                        Complete
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center text-slate-500 py-20 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200/50 dark:border-slate-800/50">
              <Truck size={48} className="mx-auto mb-4 text-slate-400" />
              <p className="text-lg font-bold">No active delivery tasks</p>
              <p className="text-sm text-slate-400 mt-1">Check back when the shopkeeper assigns you orders!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyDeliveries;
