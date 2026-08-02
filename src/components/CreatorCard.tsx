"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Verified, Users, Image as ImageIcon } from 'lucide-react';

export default function CreatorCard() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } }
  };

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="glass-card w-full h-full p-10 flex flex-col relative overflow-hidden"
    >
      
      {/* Animated Gradient Background Glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#ff2a85] opacity-10 blur-3xl mix-blend-multiply"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <motion.div variants={itemVars} className="relative group">
          <div className="w-24 h-24 rounded-[2rem] bg-white border-2 border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden flex items-center justify-center relative z-10 group-hover:scale-105 group-hover:shadow-[0_15px_40px_rgba(255,42,133,0.2)] transition-all duration-300">
            <span className="text-5xl group-hover:rotate-12 transition-transform duration-300">🌶️</span>
          </div>
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-[#ff2a85] to-[#ffeb3b] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
        </motion.div>
        
        <div className="flex gap-4">
          <motion.div variants={itemVars} className="text-center">
            <div className="text-2xl font-black text-[#ff2a85] drop-shadow-sm">142</div>
            <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">Supporters</div>
          </motion.div>
          <motion.div variants={itemVars} className="text-center">
            <div className="text-2xl font-black text-[#00e5ff] drop-shadow-sm flex items-center justify-center gap-1">
              <Users className="w-5 h-5" /> 28
            </div>
            <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">Members</div>
          </motion.div>
        </div>
      </div>

      <motion.div variants={itemVars} className="relative z-10">
        <h2 className="text-3xl font-black text-slate-900 mb-1 flex items-center tracking-tight">
          Chilli Labs
          <Verified className="w-6 h-6 ml-2 text-[#8a2be2]" />
        </h2>
        <p className="text-xs uppercase tracking-widest font-black text-[#8a2be2] mb-6 drop-shadow-sm">
          Macro Biology Creator
        </p>

        <p className="text-slate-600 font-bold leading-relaxed">
          I produce hyper-detailed, 8K macro time-lapse videos tracking the fascinating biological processes of nature.
        </p>
      </motion.div>

      <motion.div variants={itemVars} className="mt-auto pt-6 relative z-10 w-full">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
             Coffee Goal <span className="text-amber-500">☕</span>
          </span>
          <span className="text-sm font-black text-amber-500">85%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "85%" }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full relative"
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
          </motion.div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-bold text-slate-400">170 Coffees</span>
          <span className="text-xs font-bold text-slate-400">200 Coffees</span>
        </div>
      </motion.div>
      
    </motion.div>
  );
}
