import React from 'react';
import { motion } from 'framer-motion';
import { 
  Navigation2, 
  Users, 
  Clock, 
  BarChart3, 
  Smartphone, 
  ShieldCheck 
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: 'Smart Route Optimization',
      description: 'Our proprietary algorithm finds the most efficient paths, reducing fuel costs and delivery times by up to 30%.',
      icon: <Navigation2 className="w-8 h-8" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Real-time Fleet Tracking',
      description: 'Monitor your delivery agents in real-time on an interactive map. Stay informed and keep customers updated.',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'bg-indigo-500',
    },
    {
      title: 'Automated Dispatching',
      description: 'Automatically assign orders to the nearest available agent based on workload and proximity.',
      icon: <Clock className="w-8 h-8" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Performance Analytics',
      description: 'Gain deep insights into your delivery operations with comprehensive charts and data reporting.',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'bg-pink-500',
    },
    {
      title: 'Agent Management',
      description: 'Easily manage agent profiles, performance ratings, and availability schedules in one place.',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-orange-500',
    },
    {
      title: 'Enterprise Security',
      description: 'Role-based access control and encrypted data ensure your business operations remain private and secure.',
      icon: <ShieldCheck className="w-8 h-8" />,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <section id="services" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-wider text-primary-600 uppercase mb-3"
          >
            Our Services
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-slate-900 mb-6"
          >
            Everything you need to scale your delivery fleet
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            We provide a comprehensive suite of tools designed specifically for hyper-local delivery operations.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-8 rounded-3xl hover:shadow-2xl transition-all border-slate-100 group"
            >
              <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{service.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
