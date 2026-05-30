import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Search, Users, Phone, MapPin, CheckCircle, XCircle, Trash, ToggleLeft, ToggleRight, X } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const DeliveryAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/agents');
      setAgents(response.data);
    } catch (error) {
      toast.error('Failed to fetch delivery agents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Register the user with ROLE: DELIVERY_BOY
      // The backend AuthenticationService automatically creates the agent profile!
      await api.post('/auth/register', {
        firstName: newAgent.firstName,
        lastName: newAgent.lastName,
        email: newAgent.email,
        password: newAgent.password,
        role: 'DELIVERY_BOY'
      });

      // Update phone number on the newly created agent profile (simplified for simulation)
      // Since it creates the agent, let's fetch all and show success!
      Swal.fire({
        title: 'Agent Added!',
        text: 'A new delivery boy account and profile have been created.',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'rounded-3xl shadow-xl'
        }
      });

      setShowAddModal(false);
      setNewAgent({ firstName: '', lastName: '', email: '', password: '', phone: '' });
      fetchAgents();
    } catch (error) {
      toast.error('Failed to create agent. Email might be in use.');
    }
  };

  const toggleAvailability = async (agentId, currentAvailability) => {
    try {
      const nextAvailability = !currentAvailability;
      await api.patch(`/agents/${agentId}/availability?available=${nextAvailability}`);
      toast.success(`Agent status set to ${nextAvailability ? 'Available' : 'Unavailable'}`);
      fetchAgents();
    } catch (error) {
      toast.error('Failed to update agent status');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Delivery Agents</h2>
            <p className="text-slate-500">View and manage your logistics delivery fleet</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> Add Delivery Agent
          </button>
        </div>

        {/* Agents Grid/List */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search delivery boy by name or email..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 uppercase text-xs font-bold">
                <tr>
                  <th className="px-8 py-4">Agent Name</th>
                  <th className="px-8 py-4">Email Address</th>
                  <th className="px-8 py-4">GPS Coordinates</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Toggle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-slate-500">
                      Loading fleet profiles...
                    </td>
                  </tr>
                ) : agents.length > 0 ? (
                  agents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-4 font-bold flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          <img src={`https://i.pravatar.cc/150?u=${agent.id}`} alt="agent" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{agent.name}</p>
                          <p className="text-xs text-slate-400 font-mono">ID: #AGT-{agent.id}</p>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-slate-500 text-sm">{agent.user?.email || 'N/A'}</td>
                      <td className="px-8 py-4 text-slate-500 text-sm font-mono flex items-center gap-1.5 mt-2">
                        <MapPin size={14} className="text-slate-400" />
                        {agent.currentLat && agent.currentLng ? (
                          <span>{agent.currentLat.toFixed(4)}, {agent.currentLng.toFixed(4)}</span>
                        ) : (
                          <span className="italic text-slate-400">Offline (No GPS)</span>
                        )}
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-max ${
                          agent.isAvailable 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${agent.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {agent.isAvailable ? 'Available' : 'Busy / Off'}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <button 
                          onClick={() => toggleAvailability(agent.id, agent.isAvailable)}
                          className={`p-2 transition-colors duration-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 ${
                            agent.isAvailable ? 'text-emerald-500' : 'text-slate-400'
                          }`}
                        >
                          {agent.isAvailable ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-slate-500">
                      No delivery agents registered. Click "Add Delivery Agent" to create a new profile.
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
                className="w-full max-w-xl glass-card p-10 rounded-3xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold">Register Delivery Agent</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-red-500">
                    <X />
                  </button>
                </div>

                <form onSubmit={handleAddAgent} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500 ml-1">First Name</label>
                      <input 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                        value={newAgent.firstName}
                        onChange={(e) => setNewAgent({...newAgent, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500 ml-1">Last Name</label>
                      <input 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                        value={newAgent.lastName}
                        onChange={(e) => setNewAgent({...newAgent, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Email Address</label>
                    <input 
                      required 
                      type="email"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                      value={newAgent.email}
                      onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Password</label>
                    <input 
                      required 
                      type="password"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                      placeholder="••••••••"
                      value={newAgent.password}
                      onChange={(e) => setNewAgent({...newAgent, password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Phone Number (Optional)</label>
                    <input 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 ring-primary-500/20"
                      placeholder="+91 XXXXX XXXXX"
                      value={newAgent.phone}
                      onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="w-full py-4 btn-primary mt-6">
                    Create Agent Account
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

export default DeliveryAgents;
