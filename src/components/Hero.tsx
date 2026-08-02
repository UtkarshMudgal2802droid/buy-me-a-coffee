"use client";

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import ThemeClock from './ThemeClock';

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 mt-8">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Seamless Premium Card Container */}
        <div className="relative bg-white rounded-[40px] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 flex flex-col lg:flex-row min-h-[600px]">
          
          {/* Left Content (Text) */}
          <div className="w-full lg:w-[55%] p-10 md:p-16 lg:p-20 relative z-20 flex flex-col justify-center">
            {/* Tag Pills */}
            <div className="flex gap-3 mb-8 flex-wrap">
              <span className="px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500">Groundbreaking Funding</span>
              <span className="px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500">Smart Contracts</span>
              <span className="px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500">Zero Fees</span>
            </div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-[80px] lg:text-[90px] font-black mb-6 leading-[0.95] tracking-tighter text-slate-900"
            >
              Innovating<br/>
              Transit Funding.
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 max-w-md mb-10 font-medium leading-relaxed"
            >
              Collaborate with leading creators to fund public transit technology and solutions for the city. Accept ETH directly to your wallet.
            </motion.p>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <a 
                href="#demo" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-4 bg-slate-900 text-white rounded-full pl-8 pr-2 py-2 font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl"
              >
                DISCOVER
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  ↗
                </div>
              </a>
            </motion.div>
          </div>

          {/* Right Content (4K 3D Image perfectly blended) */}
          <div className="w-full lg:w-[45%] relative min-h-[400px] lg:min-h-full flex items-center justify-center bg-white">
            <motion.div 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {/* The mask-image creates a seamless fade from the white background into the image */}
              <img 
                src="/transit_hero_3d.png" 
                alt="4K 3D Futuristic Transit" 
                className="w-full h-full object-cover object-center lg:object-left"
                style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%)', maskImage: 'linear-gradient(to right, transparent 0%, black 25%)' }}
              />
            </motion.div>
          </div>
          
        </div>
      </div>

      {/* Interactive Cursor Glow Background (Softened to match premium feel) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 z-0"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          backgroundColor: ["#e2e8f0", "#f1f5f9", "#cbd5e1", "#e2e8f0"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}
