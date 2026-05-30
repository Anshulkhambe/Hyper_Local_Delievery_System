import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-[3rem] overflow-hidden bg-slate-900 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Contact Info */}
            <div className="lg:w-2/5 p-12 bg-gradient-to-br from-primary-700 to-indigo-900 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-6">Let's connect</h3>
                <p className="text-primary-100 mb-12 text-lg">
                  Ready to optimize your delivery fleet? Get in touch with our experts today.
                </p>

                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-primary-200 uppercase font-bold">Email us</p>
                      <p className="font-medium">support@fleetopt.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-primary-200 uppercase font-bold">Call us</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-primary-200 uppercase font-bold">Visit us</p>
                      <p className="font-medium">123 Logistics Way, Tech City</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-20 flex space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer" />
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:w-3/5 p-12 text-slate-900 bg-white">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company Size</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all appearance-none bg-white">
                    <option>1-10 Employees</option>
                    <option>11-50 Employees</option>
                    <option>51-200 Employees</option>
                    <option>200+ Employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">How can we help?</label>
                  <textarea 
                    rows="4" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                    placeholder="Tell us about your delivery needs..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center space-x-2 group"
                >
                  <span>Send Message</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
