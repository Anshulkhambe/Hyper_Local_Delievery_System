import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, ShieldCheck } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { label: 'Deliveries Optimized', value: '1M+' },
    { label: 'Happy Retailers', value: '500+' },
    { label: 'Reduction in Costs', value: '30%' },
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Delivery" 
                className="rounded-2xl shadow-xl aspect-square object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Logistics" 
                className="rounded-2xl shadow-xl aspect-[3/4] object-cover"
              />
            </div>
            <div className="space-y-4 pt-12">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Team" 
                className="rounded-2xl shadow-xl aspect-[3/4] object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1521791136364-798a730bb361?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Meeting" 
                className="rounded-2xl shadow-xl aspect-square object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold tracking-wider text-primary-600 uppercase mb-3">About Us</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Revolutionizing Last-Mile Delivery for Everyone</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Founded in 2024, FleetOpt was born out of a simple problem: local retailers were struggling to manage deliveries efficiently. Our mission is to democratize high-end logistics technology, making it accessible to businesses of all sizes.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600 shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Our Vision</h4>
                  <p className="text-slate-600 text-sm">To be the backbone of every hyper-local delivery network globally.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Our Reliability</h4>
                  <p className="text-slate-600 text-sm">Enterprise-grade security and 99.9% uptime for your critical operations.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-slate-100 pt-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
