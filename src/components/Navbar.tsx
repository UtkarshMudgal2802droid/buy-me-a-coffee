"use client";

import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Coffee } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navLinks = [
    { name: 'Creators', id: 'demo' }
  ];

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-150%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-0 sm:px-6 w-full"
    >
      <div className="w-full bg-white/70 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 px-3 hover:opacity-80 transition-opacity">
          <div className="bg-slate-900 rounded-full p-2 shadow-sm">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 hidden sm:block">utkarsh.praiseboard</span>
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => {
                const el = document.getElementById(link.id);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right: Actions (Animated Yellow Button) */}
        <div className="flex items-center relative group">
          {/* Animated flowing line outside the box */}
          <motion.div 
            className="absolute -inset-1 rounded-full bg-gradient-to-r from-bmc-yellow via-[#10b981] to-bmc-yellow opacity-75 blur-sm"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: "200% 200%" }}
          />
          <button 
            onClick={() => {
              const el = document.getElementById('demo');
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
            className="relative bg-bmc-yellow text-slate-900 font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors cursor-pointer shadow-md z-10"
          >
            Start Tipping
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
