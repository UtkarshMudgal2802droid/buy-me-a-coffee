"use client";

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Verified, Users, Image as ImageIcon } from 'lucide-react';

export default function CreatorCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
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
        className="glass-card overflow-hidden transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
        style={{ transform: "translateZ(50px)" }}
      >
        {/* Cover Photo */}
        <div className="h-48 w-full bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
          {/* Mock abstract representation of chillies drying */}
          <div className="absolute inset-0 opacity-50 overflow-hidden">
            <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[200%] bg-[url('https://images.unsplash.com/photo-1596568160759-4591fcf3b2cb?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center blur-[2px]"></div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8 pt-0 relative z-20">
          <div className="flex justify-between items-end mb-6">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-2xl bg-slate-800 border-4 border-slate-950 overflow-hidden shadow-2xl -mt-14 relative z-30 flex items-center justify-center">
              <span className="text-4xl">🌶️</span>
            </div>
            
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">142</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Supporters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center gap-1"><Users className="w-4 h-4 text-warm-amber"/> 28</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Members</div>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
              Chilli Time-Lapse Labs
              <Verified className="w-6 h-6 text-electric-purple" />
            </h1>
            <p className="text-electric-purple font-medium mb-6">Macro Biology & Nature Creator</p>
            
            <p className="text-slate-300 leading-relaxed text-lg mb-6">
              I produce hyper-detailed, 8K macro time-lapse videos tracking the fascinating biological processes of nature. 
              My current obsession? Documenting the complete drying lifecycle of rare chillies from around the world.
            </p>

            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Time-Lapse
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">Nature</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">Web3 Content</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
