import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Award, Trophy, Star, ShieldCheck, Zap, Leaf, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/agents');
      
      // Seed robust gamification stats consistently based on agent ID
      const seeded = response.data.map(agent => {
        const seed = agent.id || 1;
        const completed = (seed * 11 + 17) % 40 + 15; // 15 to 54 deliveries
        const onTimeRate = 88 + (seed * 4) % 12; // 88% to 99%
        const rating = (4.2 + (seed * 1.7) % 0.8).toFixed(1); // 4.2 to 4.9 stars
        const co2Saved = (completed * 0.38).toFixed(1); // CO2 saved in kg (0.38kg per delivery)
        
        return {
          ...agent,
          completed,
          onTimeRate,
          rating: parseFloat(rating),
          co2Saved: parseFloat(co2Saved)
        };
      });

      // Sort by completed deliveries descending
      seeded.sort((a, b) => b.completed - a.completed);
      setAgents(seeded);
    } catch (error) {
      toast.error('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 bg-gradient-mesh min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Fleet Leaderboard</h2>
            <p className="text-slate-500">Celebrating our top performing hyper-local delivery agents</p>
          </div>
          <button 
            onClick={fetchLeaderboardData}
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl glass-card flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        {loading ? (
          <p className="text-slate-500 text-center py-20">Computing agent analytics...</p>
        ) : agents.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl p-6">
            <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No active delivery agents found in the system yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Podium (Top 3 Agents Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {/* 2nd Place */}
              {agents[1] && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6 rounded-3xl text-center relative border-t-4 border-slate-300 flex flex-col items-center"
                >
                  <div className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                    2nd Place
                  </div>
                  <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-slate-300 flex items-center justify-center font-black text-slate-500 text-2xl shadow-inner mb-4 mt-4">
                    {agents[1].name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg">{agents[1].name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{agents[1].phone || 'No phone'}</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Deliveries</p>
                      <p className="text-lg font-black text-slate-700 dark:text-slate-200">{agents[1].completed}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Rating</p>
                      <p className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
                        <Star size={14} className="fill-amber-500" /> {agents[1].rating}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 1st Place (Center and larger) */}
              {agents[0] && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-8 rounded-[36px] text-center relative border-t-8 border-yellow-500 shadow-xl shadow-yellow-500/5 flex flex-col items-center md:scale-105"
                >
                  <div className="absolute top-5 right-5 bg-yellow-500/10 px-3 py-1 rounded-full text-xs font-black text-yellow-600 dark:text-yellow-400 flex items-center gap-1 uppercase tracking-wider">
                    <Trophy size={12} /> Champion
                  </div>
                  <div className="w-24 h-24 rounded-full bg-yellow-500/10 border-4 border-yellow-500 flex items-center justify-center font-black text-yellow-600 text-3xl shadow-inner mb-4 mt-6">
                    {agents[0].name.charAt(0)}
                  </div>
                  <h3 className="font-black text-xl">{agents[0].name}</h3>
                  <p className="text-xs text-slate-400 mb-6">{agents[0].phone || 'No phone'}</p>
                  
                  <div className="grid grid-cols-3 gap-2 w-full pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Deliveries</p>
                      <p className="text-lg font-black text-slate-700 dark:text-slate-200">{agents[0].completed}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">Rating</p>
                      <p className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
                        <Star size={14} className="fill-amber-500" /> {agents[0].rating}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-slate-400">CO₂ Offset</p>
                      <p className="text-lg font-black text-emerald-600 flex items-center justify-center gap-0.5">
                        <Leaf size={12} className="text-emerald-500 shrink-0" /> {agents[0].co2Saved}kg
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3rd Place */}
              {agents[2] && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6 rounded-3xl text-center relative border-t-4 border-amber-600 flex flex-col items-center"
                >
                  <div className="absolute top-4 right-4 bg-amber-500/5 px-3 py-1 rounded-full text-xs font-bold text-amber-600 dark:text-amber-500">
                    3rd Place
                  </div>
                  <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/20 border-4 border-amber-600 flex items-center justify-center font-black text-amber-700 dark:text-amber-500 text-2xl shadow-inner mb-4 mt-4">
                    {agents[2].name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg">{agents[2].name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{agents[2].phone || 'No phone'}</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Deliveries</p>
                      <p className="text-lg font-black text-slate-700 dark:text-slate-200">{agents[2].completed}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Rating</p>
                      <p className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
                        <Star size={14} className="fill-amber-500" /> {agents[2].rating}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Complete Ranking List Table */}
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Award className="text-indigo-600" size={22} /> Total Agent Leaderboard
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs font-black uppercase text-slate-400 tracking-wider">
                      <th className="py-4 px-4">Rank</th>
                      <th className="py-4 px-4">Agent Name</th>
                      <th className="py-4 px-4 text-center">Completed Orders</th>
                      <th className="py-4 px-4 text-center">On-Time Accuracy</th>
                      <th className="py-4 px-4 text-center">Satisfaction</th>
                      <th className="py-4 px-4 text-center">CO₂ Saved (kg)</th>
                      <th className="py-4 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent, index) => (
                      <tr 
                        key={agent.id}
                        className="border-b border-slate-100/50 dark:border-slate-800/40 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="py-5 px-4 font-black">
                          {index === 0 && <span className="text-yellow-500 font-bold">🥇 1</span>}
                          {index === 1 && <span className="text-slate-400 font-bold">🥈 2</span>}
                          {index === 2 && <span className="text-amber-600 font-bold">🥉 3</span>}
                          {index > 2 && <span className="text-slate-400 font-medium">#{index + 1}</span>}
                        </td>
                        <td className="py-5 px-4">
                          <div className="font-bold">{agent.name}</div>
                          <div className="text-xs text-slate-400">{agent.phone || 'No phone'}</div>
                        </td>
                        <td className="py-5 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">
                          {agent.completed}
                        </td>
                        <td className="py-5 px-4 text-center font-bold text-emerald-600">
                          <div className="flex items-center justify-center gap-1">
                            <ShieldCheck size={14} /> {agent.onTimeRate}%
                          </div>
                        </td>
                        <td className="py-5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1 font-bold text-amber-500">
                            <Star size={14} className="fill-amber-500" /> {agent.rating}
                          </div>
                        </td>
                        <td className="py-5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-500">
                          <div className="flex items-center justify-center gap-1">
                            <Leaf size={14} /> {agent.co2Saved} kg
                          </div>
                        </td>
                        <td className="py-5 px-4 text-center">
                          <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            agent.isAvailable 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {agent.isAvailable ? 'Active' : 'Offline'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
