"use client";

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Verified, Users, Image as ImageIcon } from 'lucide-react';

export default function CreatorCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "-100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-3xl"
    >
      <div 
        className="glass-card overflow-hidden transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative group"
        style={{ transform: "translateZ(50px)" }}
      >
        {/* Dynamic Glare Effect */}
        <motion.div 
          className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), transparent 40%)",
            x: glareX,
            y: glareY,
          }}
        />

        {/* Cover Photo */}
        <div className="h-56 w-full bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 opacity-40 overflow-hidden">
            <div className="absolute inset-[-50%] bg-[url('https://images.unsplash.com/photo-1596568160759-4591fcf3b2cb?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center blur-sm"></div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8 pt-0 relative z-20 bg-gradient-to-b from-transparent to-slate-950/50">
          <div className="flex justify-between items-end mb-8">
            {/* Avatar */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-32 h-32 rounded-3xl bg-slate-800 border-4 border-slate-950 overflow-hidden shadow-[0_0_20px_rgba(147,51,234,0.4)] -mt-16 relative z-30 flex items-center justify-center"
            >
              <span className="text-5xl drop-shadow-md">🌶️</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-6"
            >
              <div className="text-center group/stat">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover/stat:from-electric-purple group-hover/stat:to-cyber-blue transition-all">142</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Supporters</div>
              </div>
              <div className="text-center group/stat">
                <div className="text-3xl font-black flex items-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover/stat:from-warm-amber group-hover/stat:to-orange-500 transition-all">
                  <Users className="w-5 h-5 text-warm-amber"/> 28
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Members</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
              Chilli Time-Lapse Labs
              <Verified className="w-8 h-8 text-cyber-blue drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            </h1>
            <p className="text-electric-purple font-bold mb-6 tracking-wide">Macro Biology & Nature Creator</p>
            
            <p className="text-slate-300 leading-relaxed text-lg mb-8 font-light">
              I produce hyper-detailed, 8K macro time-lapse videos tracking the fascinating biological processes of nature. 
              My current obsession? Documenting the complete drying lifecycle of rare chillies from around the world.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 font-bold flex items-center gap-2 hover:bg-white/10 hover:border-white/30 transition-colors">
                <ImageIcon className="w-4 h-4" /> Time-Lapse
              </span>
              <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 font-bold hover:bg-white/10 hover:border-white/30 transition-colors">Nature</span>
              <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 font-bold hover:bg-white/10 hover:border-white/30 transition-colors">Web3 Content</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
