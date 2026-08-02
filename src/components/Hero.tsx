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
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const wordVars = {
    hidden: { y: "100%", opacity: 0 },
    show: { 
      y: "0%", 
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-32 pb-20 px-4">
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Main Glass Container matching reference */}
        <div className="relative bg-white/70 backdrop-blur-2xl border border-white rounded-[40px] p-10 md:p-20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
          
          <div className="max-w-3xl relative z-20">
            {/* Tag Pills */}
            <div className="flex gap-4 mb-10 flex-wrap">
              <span className="px-5 py-2 rounded-full border border-slate-200 bg-white/50 text-xs font-black uppercase tracking-widest text-slate-500">Groundbreaking Funding</span>
              <span className="px-5 py-2 rounded-full border border-slate-200 bg-white/50 text-xs font-black uppercase tracking-widest text-slate-500">Smart Contracts</span>
              <span className="px-5 py-2 rounded-full border border-slate-200 bg-white/50 text-xs font-black uppercase tracking-widest text-slate-500">Zero Fees</span>
            </div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-[100px] font-black mb-8 leading-[0.9] tracking-tighter text-slate-900"
            >
              Innovating<br/>
              Transit Funding.
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 max-w-xl mb-12 font-medium leading-relaxed"
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
                className="inline-flex items-center gap-4 bg-slate-900 text-white rounded-full pl-8 pr-3 py-3 font-bold text-lg hover:bg-slate-800 transition-colors shadow-xl"
              >
                DISCOVER
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  ↗
                </div>
              </a>
            </motion.div>
          </div>

          {/* 4K 3D Render Object - perfectly positioned and overlapping like reference */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: 0,
              y: [0, -15, 0] // Floating animation
            }}
            transition={{ 
              y: {
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              },
              default: {
                type: "spring", 
                stiffness: 80, 
                damping: 20, 
                delay: 0.2 
              }
            }}
            className="absolute right-[-10%] bottom-[-20%] w-[800px] h-[800px] hidden lg:block z-30 pointer-events-none mix-blend-multiply"
          >
            <img 
              src="/transit_hero_3d.png" 
              alt="4K 3D Futuristic Transit" 
              className="w-full h-full object-contain object-bottom scale-125 origin-bottom-right"
            />
          </motion.div>
          
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
