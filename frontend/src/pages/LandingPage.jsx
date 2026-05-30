import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import AboutUs from '../components/landing/AboutUs';
import Services from '../components/landing/Services';
import WhyChooseUs from '../components/landing/WhyChooseUs';
import Testimonials from '../components/landing/Testimonials';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';
import { motion, useScroll, useSpring } from 'framer-motion';

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary-600 origin-left z-[60]"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main>
        <Hero />
        <AboutUs />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
