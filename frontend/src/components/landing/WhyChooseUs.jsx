import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, DollarSign, HeartHandshake } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    {
      title: 'Lightning Fast Setup',
      description: 'Get your fleet up and running in minutes, not days. Integration is seamless and intuitive.',
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
    },
    {
      title: 'Cost Effective',
      description: 'Save significantly on delivery overheads through intelligent resource allocation.',
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
    },
    {
      title: 'Unmatched Accuracy',
      description: 'Our algorithms consider traffic, road conditions, and order priority for perfect routing.',
      icon: <CheckCircle2 className="w-6 h-6 text-blue-500" />,
    },
    {
      title: 'Dedicated Support',
      description: 'We are here for you 24/7 to ensure your delivery operations never stop.',
      icon: <HeartHandshake className="w-6 h-6 text-pink-500" />,
    },
  ];

  return (
    <section id="why" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold tracking-wider text-primary-600 uppercase mb-3"
            >
              Why Choose FleetOpt?
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold text-slate-900 mb-8"
            >
              Building the future of <br /> local commerce together
            </motion.h3>
            
            <div className="space-y-8">
              {reasons.map((reason, index) => (
                <motion.div 
                  key={reason.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="mt-1 p-2 bg-slate-50 rounded-lg group-hover:bg-primary-50 transition-colors">
                    {reason.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{reason.title}</h4>
                    <p className="text-slate-600 max-w-md leading-relaxed">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1512418490979-92798ccc13a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Delivery person" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-10">
                <div className="glass-card bg-white/10 text-white p-6 rounded-2xl border-white/20">
                  <p className="text-sm font-medium mb-1">Efficiency Boost</p>
                  <p className="text-3xl font-bold">+45%</p>
                </div>
              </div>
            </div>
            
            {/* Decorative dots */}
            <div className="absolute -top-10 -right-10 grid grid-cols-5 gap-2 -z-10 opacity-20">
              {[...Array(25)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-primary-600 rounded-full" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
