import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Search, Filter, MoreVertical, Truck, CheckCircle, Clock, XCircle, X } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    address: '',
    latitude: '',
    longitude: '',
    totalAmount: ''
  });

  // Action Menu States
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      await api.post('/orders', {
        ...newOrder,
        latitude: parseFloat(newOrder.latitude),
        longitude: parseFloat(newOrder.longitude),
        totalAmount: parseFloat(newOrder.totalAmount),
        status: 'PENDING'
      });
      Swal.fire({
        title: 'Order Created!',
        text: 'A new delivery order has been added to the system.',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-3xl shadow-xl'
        }
      });
      setShowAddModal(false);
      setNewOrder({ customerName: '', address: '', latitude: '', longitude: '', totalAmount: '' });
      fetchOrders();
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  const handleCancelOrder = async (orderId) => {
    setActiveDropdownId(null);
    Swal.fire({
      title: 'Cancel Order?',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, cancel it!',
      customClass: {
        popup: 'rounded-3xl shadow-xl border border-slate-200/50'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/orders/${orderId}/status?status=CANCELLED`);
          Swal.fire({
            title: 'Cancelled!',
            text: 'Order has been cancelled.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup: 'rounded-3xl shadow-xl border border-slate-200/50'
            }
          });
          fetchOrders();
        } catch (error) {
          toast.error('Failed to cancel order');
        }
      }
    });
  };

  const handleOpenAssignModal = async (order) => {
    setActiveDropdownId(null);
    setSelectedOrder(order);
    setShowAssignModal(true);
    try {
      const response = await api.get('/agents/available');
      setAgents(response.data);
    } catch (error) {
      toast.error('Failed to fetch available agents');
    }
  };

  const handleAssignAgent = async (e) => {
    e.preventDefault();
    if (!selectedAgent) {
      toast.warning('Please select a delivery boy');
      return;
    }
    try {
      await api.post(`/orders/${selectedOrder.id}/assign/${selectedAgent}`);
      Swal.fire({
        title: 'Assigned!',
        text: 'Order assigned to agent successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-3xl shadow-xl'
        }
      });
      setShowAssignModal(false);
      setSelectedAgent('');
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to assign agent');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-600';
      case 'PENDING': return 'bg-amber-100 text-amber-600';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-600';
      case 'OUT_FOR_DELIVERY': return 'bg-purple-100 text-purple-600';
      case 'CANCELLED': return 'bg-rose-100 text-rose-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Orders Management</h2>
            <p className="text-slate-500">Track and manage all delivery requests</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> Create New Order
          </button>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by order ID or customer..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
              />
            </div>
            <div className="flex gap-2">
              <button className="p-2 glass-card rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 uppercase text-xs font-bold">
                <tr>
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Address</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-4 font-bold text-primary-600">#ORD-{order.id}</td>
                    <td className="px-8 py-4">{order.customerName}</td>
                    <td className="px-8 py-4 text-slate-500 text-sm">{order.address}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-4 font-medium">₹{order.totalAmount}</td>
                    <td className="px-8 py-4 relative">
                      <button 
                        onClick={() => setActiveDropdownId(activeDropdownId === order.id ? null : order.id)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdownId === order.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-8 top-12 w-48 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-xl z-20 overflow-hidden"
                            >
                              {order.status === 'PENDING' && (
                                <button
                                  onClick={() => handleOpenAssignModal(order)}
                                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/55 flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200"
                                >
                                  <Truck size={14} className="text-primary-500" />
                                  Assign Agent
                                </button>
                              )}
                              {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 font-bold text-red-600 dark:text-red-400"
                                >
                                  <XCircle size={14} />
                                  Cancel Order
                                </button>
                              )}
                              {order.status === 'DELIVERED' && (
                                <div className="px-4 py-3 text-xs text-slate-400 italic">
                                  No actions available
                                </div>
                              )}
                              {order.status === 'CANCELLED' && (
                                <div className="px-4 py-3 text-xs text-slate-400 italic">
                                  Cancelled
                                </div>
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="px-8 py-10 text-center text-slate-500">
                      No orders found. Click "Create New Order" to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-lg glass-card p-10 rounded-3xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold">New Delivery Order</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-red-500">
                    <XCircle />
                  </button>
                </div>

                <form onSubmit={handleAddOrder} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Customer Name</label>
                    <input 
                      required 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Delivery Address</label>
                    <input 
                      required 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                      value={newOrder.address}
                      onChange={(e) => setNewOrder({...newOrder, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500 ml-1">Latitude</label>
                      <input 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                        placeholder="12.97"
                        value={newOrder.latitude}
                        onChange={(e) => setNewOrder({...newOrder, latitude: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500 ml-1">Longitude</label>
                      <input 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                        placeholder="77.59"
                        value={newOrder.longitude}
                        onChange={(e) => setNewOrder({...newOrder, longitude: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Amount (₹)</label>
                    <input 
                      required 
                      type="number"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                      value={newOrder.totalAmount}
                      onChange={(e) => setNewOrder({...newOrder, totalAmount: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="w-full py-4 btn-primary mt-6">
                    Confirm Order
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Assign Modal */}
        <AnimatePresence>
          {showAssignModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md glass-card p-10 rounded-3xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold">Assign Delivery Agent</h3>
                  <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-red-500">
                    <XCircle />
                  </button>
                </div>

                <form onSubmit={handleAssignAgent} className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm text-slate-500">
                      Select an online delivery boy to assign to <strong>Order #ORD-{selectedOrder?.id}</strong>.
                    </p>
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Available Agents</label>
                    <select 
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                    >
                      <option value="">Select a delivery boy...</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                      ))}
                    </select>
                  </div>

                  {agents.length === 0 && (
                    <p className="text-xs text-amber-500 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                      No online delivery agents are available right now. Mark an agent available on the "Delivery Agents" tab first!
                    </p>
                  )}

                  <button 
                    type="submit" 
                    disabled={agents.length === 0}
                    className="w-full py-4 btn-primary mt-6 disabled:opacity-50"
                  >
                    Confirm Assignment
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Orders;
