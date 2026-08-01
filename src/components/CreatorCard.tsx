"use client";

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Verified, Users, Image as ImageIcon } from 'lucide-react';

export default function CreatorCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
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
        className="glass-card overflow-hidden transition-all duration-500 relative group"
        style={{ transform: "translateZ(30px)" }}
      >
        {/* Dynamic Glare Effect */}
        <motion.div 
          className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,1), transparent 30%)",
            x: glareX,
            y: glareY,
          }}
        />

        {/* Cover Photo */}
        <div className="h-56 w-full bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-[-50%] bg-[url('https://images.unsplash.com/photo-1596568160759-4591fcf3b2cb?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center blur-sm"></div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8 pt-0 relative z-20 bg-gradient-to-b from-transparent to-[#030712]/90">
          <div className="flex justify-between items-end mb-8">
            {/* Avatar */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-32 h-32 rounded-2xl bg-slate-900 border border-white/20 overflow-hidden -mt-16 relative z-30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              <span className="text-5xl drop-shadow-md">🌶️</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-8"
            >
              <div className="text-center group/stat">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue">142</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold mt-1">Supporters</div>
              </div>
              <div className="text-center group/stat">
                <div className="text-2xl font-black flex items-center justify-center gap-1 text-transparent bg-clip-text bg-gradient-to-r from-neon-amber to-neon-magenta">
                  <Users className="w-4 h-4 text-neon-amber"/> 28
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold mt-1">Members</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3 text-white">
              Chilli Time-Lapse Labs
              <Verified className="w-6 h-6 text-neon-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            </h1>
            <p className="text-neon-purple font-medium mb-6 tracking-wide text-sm drop-shadow-[0_0_5px_rgba(168,85,247,0.4)]">Macro Biology & Nature Creator</p>
            
            <p className="text-slate-300 leading-relaxed mb-8 font-normal text-sm">
              I produce hyper-detailed, 8K macro time-lapse videos tracking the fascinating biological processes of nature. 
              My current obsession? Documenting the complete drying lifecycle of rare chillies from around the world.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-semibold flex items-center gap-2 hover:text-white hover:border-white/30 transition-colors cursor-default shadow-inner">
                <ImageIcon className="w-3 h-3" /> Time-Lapse
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-semibold hover:text-white hover:border-white/30 transition-colors cursor-default shadow-inner">Nature</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-semibold hover:text-white hover:border-white/30 transition-colors cursor-default shadow-inner">Web3 Content</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
