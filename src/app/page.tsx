import React from 'react';
import Hero from '@/components/Hero';
import CreatorCard from '@/components/CreatorCard';
import DonationWidget from '@/components/DonationWidget';
import PraiseBoardWidget from '@/components/PraiseBoardWidget';
import Navbar from '@/components/Navbar';
import * as motion from 'framer-motion/client';

export default function Home() {
  return (
    <main className="w-full min-h-screen relative overflow-hidden bg-slate-50">
      {/* Soft Charity Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply opacity-20 animate-blob bg-gradient-to-r from-emerald-300 to-teal-300 blur-3xl pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000 bg-gradient-to-r from-blue-300 to-emerald-200 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000 bg-gradient-to-r from-teal-200 to-blue-200 blur-3xl pointer-events-none"></div>

      <Navbar />
      
      {/* Section 1: Hero */}
      <section id="home" className="w-full min-h-screen flex items-center justify-center pt-32 pb-20 px-6 relative z-10">
        <Hero />
      </section>

      {/* Section 2: Creator Profile & Donation Side-by-Side */}
      <section id="demo" className="w-full min-h-screen flex flex-col justify-center py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch perspective-1000">
          
          {/* Left Column: Creator Profile (Scroll Reveal with Tilt) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 15, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flex justify-end"
          >
            <div className="w-full max-w-md h-[550px]">
              <CreatorCard />
            </div>
          </motion.div>

          {/* Right Column: Donation Widget (Scroll Reveal with Tilt) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -15, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            className="flex justify-start"
          >
            <div className="w-full max-w-md h-[550px]">
              <DonationWidget />
            </div>
          </motion.div>
          
        </div>

        {/* Ledger History placed below */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        >
          <PraiseBoardWidget />
        </motion.div>
      </section>

    </main>
  );
}
