"use client";

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Verified, Users, Image as ImageIcon } from 'lucide-react';

export default function CreatorCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
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
      className="relative w-full h-full rounded-[2.5rem]"
    >
      <div 
        className="glass-card overflow-hidden transition-all duration-500 relative group h-full flex flex-col"
        style={{ transform: "translateZ(40px)" }}
      >
        {/* Dynamic Glare Effect */}
        <motion.div 
          className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,1), transparent 40%)",
            x: glareX,
            y: glareY,
          }}
        />

        {/* Cover Photo */}
        <div className="h-48 w-full bg-[#f8fafc] relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 opacity-70">
            <div className="absolute inset-[-50%] bg-[url('https://images.unsplash.com/photo-1596568160759-4591fcf3b2cb?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center blur-sm saturate-200"></div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8 pt-0 relative z-20 flex-1 flex flex-col">
          <div className="flex justify-between items-end mb-6">
            {/* Avatar */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-28 h-28 rounded-3xl bg-white border-4 border-[#f8fafc] overflow-hidden -mt-14 relative z-30 flex items-center justify-center shadow-[0_15px_30px_rgba(255,42,133,0.3)]"
            >
              <span className="text-5xl drop-shadow-lg">🌶️</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-6"
            >
              <div className="text-center group/stat">
                <div className="text-3xl font-black text-[#ff2a85] drop-shadow-sm">142</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Supporters</div>
              </div>
              <div className="text-center group/stat">
                <div className="text-3xl font-black flex items-center justify-center gap-1 text-[#00e5ff] drop-shadow-sm">
                  <Users className="w-5 h-5"/> 28
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Members</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex-1 flex flex-col"
          >
            <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3 text-slate-900">
              Chilli Labs
              <Verified className="w-8 h-8 text-[#8a2be2] drop-shadow-[0_0_10px_rgba(138,43,226,0.3)]" />
            </h1>
            <p className="text-[#8a2be2] font-black mb-4 tracking-wider text-sm uppercase">Macro Biology Creator</p>
            
            <p className="text-slate-600 leading-relaxed mb-8 font-bold text-lg flex-1">
              I produce hyper-detailed, 8K macro time-lapse videos tracking the fascinating biological processes of nature. 
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 rounded-xl bg-[#ff2a85]/10 border-2 border-[#ff2a85]/20 text-xs text-[#ff2a85] font-black flex items-center gap-2 hover:bg-[#ff2a85]/20 transition-colors shadow-sm">
                <ImageIcon className="w-4 h-4" /> Time-Lapse
              </span>
              <span className="px-4 py-2 rounded-xl bg-[#00e5ff]/10 border-2 border-[#00e5ff]/20 text-xs text-[#00e5ff] font-black hover:bg-[#00e5ff]/20 transition-colors shadow-sm">Nature</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
