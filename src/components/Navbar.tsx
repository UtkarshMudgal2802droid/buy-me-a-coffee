"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Hexagon, TerminalSquare } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '#home', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Features', href: '#features', icon: <Hexagon className="w-4 h-4" /> },
    { name: 'Creator Demo', href: '#demo', icon: <Hexagon className="w-4 h-4" /> },
    { name: 'Praise Board', href: '#praise-board', icon: <TerminalSquare className="w-4 h-4" /> },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
    >
      <div className="glass-card px-2 py-2 flex items-center justify-between rounded-full bg-slate-950/40 border-white/10 shadow-2xl backdrop-blur-xl overflow-x-auto">
        {navLinks.map((link) => {
          return (
            <a key={link.href} href={link.href} className="relative flex-1 group min-w-max">
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-bold transition-all duration-300 text-slate-400 group-hover:text-white hover:bg-white/10">
                {link.icon}
                {link.name}
              </div>
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}
