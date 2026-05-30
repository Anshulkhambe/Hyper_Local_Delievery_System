import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 rounded-3xl relative overflow-hidden group"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500 ${color}`} />
      
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-20`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        <span className="text-slate-500 font-medium">{title}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
