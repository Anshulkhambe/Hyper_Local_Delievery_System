import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Navigation, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-indigo-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Next-Gen Logistics Router</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Deliver Faster with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                Smart Routing
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              Optimize your hyper-local delivery fleet with AI-powered algorithms. Reduce costs, improve speed, and delight your customers.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="btn-primary py-4 px-8 text-lg font-semibold flex items-center justify-center group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#services"
                className="px-8 py-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center"
              >
                Explore Features
              </a>
            </div>
            
            <div className="mt-12 flex items-center space-x-6 text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">
                <span className="text-slate-900 font-bold">500+</span> retailers trust FleetOpt
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 glass-card p-4 rounded-3xl overflow-hidden">
              <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-[4/3] relative">
                {/* Mock UI Element */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="glass-card bg-white/10 text-white p-3 rounded-xl border-white/20">
                      <p className="text-xs opacity-70">Active Routes</p>
                      <p className="text-xl font-bold">24 Agents</p>
                    </div>
                    <div className="glass-card bg-white/10 text-white p-3 rounded-xl border-white/20">
                      <p className="text-xs opacity-70">Avg. Time</p>
                      <p className="text-xl font-bold">12.5 min</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-primary-500" 
                      />
                    </div>
                    <p className="text-white text-xs font-medium">Optimizing last-mile delivery...</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Icons */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 glass-card p-4 rounded-2xl text-primary-600"
            >
              <Navigation className="w-8 h-8" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 glass-card p-5 rounded-2xl text-indigo-600 shadow-2xl"
            >
              <MapPin className="w-10 h-10" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
