"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Verified, Users, Coffee } from 'lucide-react';

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

  const goals = [
    { title: "New Video Equipment", current: 170, max: 200 },
    { title: "Hire a Video Editor", current: 50, max: 500 }
  ];

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="glass-card w-full h-full p-10 flex flex-col relative overflow-hidden"
    >
      
      {/* Soft Background Accent */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-bmc-yellow opacity-20 blur-3xl mix-blend-multiply"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <motion.div variants={itemVars} className="relative group">
          <div className="w-24 h-24 rounded-[2rem] bg-white border-2 border-bmc-dark shadow-[4px_4px_0px_0px_rgba(34,34,34,1)] overflow-hidden flex items-center justify-center relative z-10 group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(34,34,34,1)] transition-all duration-300">
            <span className="text-5xl group-hover:rotate-12 transition-transform duration-300">🌶️</span>
          </div>
        </motion.div>
        
        <div className="flex gap-4">
          <motion.div variants={itemVars} className="text-center">
            <div className="text-2xl font-black text-bmc-dark drop-shadow-sm">142</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Supporters</div>
          </motion.div>
          <motion.div variants={itemVars} className="text-center">
            <div className="text-2xl font-black text-bmc-dark drop-shadow-sm flex items-center justify-center gap-1">
              <Users className="w-5 h-5" /> 28
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Members</div>
          </motion.div>
        </div>
      </div>

      <motion.div variants={itemVars} className="relative z-10">
        <h2 className="text-3xl font-black text-bmc-dark mb-1 flex items-center tracking-tight">
          Chilli Labs
          <Verified className="w-6 h-6 ml-2 text-bmc-yellow" />
        </h2>
        <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 drop-shadow-sm">
          Macro Biology Creator
        </p>

        <p className="text-slate-600 font-medium leading-relaxed">
          I produce hyper-detailed, 8K macro time-lapse videos tracking the fascinating biological processes of nature.
        </p>
      </motion.div>

      <motion.div variants={itemVars} className="mt-auto pt-6 relative z-10 w-full flex flex-col gap-6">
        {goals.map((goal, index) => {
          const progress = Math.min(100, Math.round((goal.current / goal.max) * 100));
          return (
            <div key={index} className="w-full">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                   {goal.title} <Coffee className="w-3 h-3 text-bmc-dark" />
                </span>
                <span className="text-sm font-black text-bmc-dark">{progress}%</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (index * 0.2) }}
                  className="h-full bg-bmc-yellow relative"
                >
                  <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </motion.div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-bold text-slate-400">{goal.current} Coffees</span>
                <span className="text-xs font-bold text-slate-400">{goal.max} Coffees</span>
              </div>
            </div>
          );
        })}
      </motion.div>
      
    </motion.div>
  );
}
