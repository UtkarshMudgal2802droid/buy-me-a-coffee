"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TerminalSquare } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const navLinks = [
    { name: 'Home', href: '#home', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'The Deck', href: '#demo', icon: <TerminalSquare className="w-4 h-4" /> },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto"
    >
      <div className="bg-white/70 backdrop-blur-3xl shadow-[0_10px_30px_rgba(255,42,133,0.2)] border-2 border-white px-2 py-2 flex items-center justify-between rounded-3xl">
        {navLinks.map((link) => (
          <MagneticButton key={link.name} as="a" href={link.href}>
            <div className="relative flex-1 group min-w-max cursor-pointer pointer-events-none">
              <div className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs uppercase tracking-[0.2em] font-black transition-all duration-300 text-slate-500 group-hover:text-slate-900 group-hover:bg-white group-hover:shadow-md">
                {link.name}
              </div>
            </div>
          </MagneticButton>
        ))}
      </div>
    </motion.nav>
  );
}
