import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Owner, FreshBites Bakery',
      image: 'https://i.pravatar.cc/150?u=sarah',
      text: 'FleetOpt has completely transformed our delivery workflow. We now handle twice as many orders with the same number of agents.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Operations Manager, LocalMart',
      image: 'https://i.pravatar.cc/150?u=michael',
      text: 'The route optimization algorithm is incredible. It factors in everything and our drivers love how easy it is to follow.',
      rating: 5,
    },
    {
      name: 'Elena Rodriguez',
      role: 'Founder, PetPals Delivery',
      image: 'https://i.pravatar.cc/150?u=elena',
      text: 'The real-time tracking feature has drastically reduced customer inquiries. They love being able to see exactly where their order is.',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-wider text-primary-600 uppercase mb-3"
          >
            Testimonials
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-slate-900"
          >
            Trusted by Retailers Nationwide
          </motion.h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-8 rounded-[2rem] bg-white relative hover:shadow-xl transition-shadow"
            >
              <div className="absolute top-8 right-8 text-slate-100">
                <Quote className="w-12 h-12" />
              </div>
              <div className="flex space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 italic mb-8 relative z-10 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full border-2 border-primary-100"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
