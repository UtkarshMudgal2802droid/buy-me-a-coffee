"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThemeClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const initTimer = setTimeout(() => setTime(new Date()), 0);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(timer);
    };
  }, []);

  if (!time) return null; // Avoid hydration mismatch on first render

  const secondsDegrees = (time.getSeconds() / 60) * 360;
  const minutesDegrees = (time.getMinutes() / 60) * 360 + (time.getSeconds() / 60) * 6;
  const hoursDegrees = (time.getHours() / 12) * 360 + (time.getMinutes() / 60) * 30;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        y: [0, -15, 0] // Floating animation
      }}
      transition={{ 
        y: {
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        },
        default: {
          type: "spring", 
          stiffness: 100, 
          damping: 20, 
          delay: 0.2 
        }
      }}
      className="relative w-64 h-64 rounded-full border-8 border-bmc-dark bg-white shadow-[12px_12px_0px_0px_rgba(34,34,34,1)] flex items-center justify-center overflow-hidden"
    >
      {/* Clock Face Background Detail */}
      <div className="absolute inset-0 rounded-full border-[16px] border-bmc-yellow opacity-10"></div>
      
      {/* Timetable/Transit Branding */}
      <div className="absolute top-16 text-[10px] font-black uppercase tracking-widest text-slate-400">
        Transit Time
      </div>
      
      {/* 12, 3, 6, 9 markers */}
      <div className="absolute top-4 font-black text-2xl text-bmc-dark">12</div>
      <div className="absolute right-4 font-black text-2xl text-bmc-dark">3</div>
      <div className="absolute bottom-4 font-black text-2xl text-bmc-dark">6</div>
      <div className="absolute left-4 font-black text-2xl text-bmc-dark">9</div>

      {/* Tick Marks */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-1 h-3 bg-slate-200"
          style={{
            transform: `rotate(${i * 30}deg) translateY(-100px)`
          }}
        />
      ))}

      {/* Center Dot */}
      <div className="absolute w-5 h-5 rounded-full bg-bmc-yellow border-4 border-bmc-dark z-30"></div>

      {/* Hour Hand */}
      <div 
        className="absolute w-2.5 h-16 bg-bmc-dark rounded-full origin-bottom z-10 transition-transform duration-200 ease-out"
        style={{ transform: `rotate(${hoursDegrees}deg) translateY(-100%)`, bottom: "50%" }}
      />

      {/* Minute Hand */}
      <div 
        className="absolute w-1.5 h-24 bg-bmc-dark rounded-full origin-bottom z-10 transition-transform duration-200 ease-out"
        style={{ transform: `rotate(${minutesDegrees}deg) translateY(-100%)`, bottom: "50%" }}
      />

      {/* Second Hand */}
      <div 
        className="absolute w-1 h-28 bg-red-500 rounded-full origin-bottom z-20 transition-transform duration-200 ease-out"
        style={{ transform: `rotate(${secondsDegrees}deg) translateY(-100%)`, bottom: "50%" }}
      />
    </motion.div>
  );
}
