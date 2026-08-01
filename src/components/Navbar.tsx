"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Hexagon, TerminalSquare } from 'lucide-react';

export default function Navbar() {
  const navLinks = [
    { name: 'Home', offset: 0, icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Features', offset: 1, icon: <Hexagon className="w-4 h-4" /> },
    { name: 'Demo', offset: 2, icon: <Hexagon className="w-4 h-4" /> },
    { name: 'Ledger', offset: 3, icon: <TerminalSquare className="w-4 h-4" /> },
  ];

  const handleNavClick = (offset: number) => {
    // Each section represents 100vh of vertical scroll
    const targetY = offset * window.innerHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto"
    >
      <div className="glass-panel px-1 py-1 flex items-center justify-between rounded-full">
        {navLinks.map((link) => (
          <button 
            key={link.name} 
            onClick={() => handleNavClick(link.offset)}
            className="relative flex-1 group min-w-max cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 text-[#737373] hover:text-[#f8f9fa] hover:bg-white/5">
              {link.name}
            </div>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
