"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const navLinks = [
    { name: 'What is this?', href: '#home' },
    { name: 'How it works', href: '#demo' },
    { name: 'Praise Board', href: '#board' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div className="w-full max-w-6xl bg-[#F4F1E9] border-2 border-bmc-dark rounded-full px-4 py-2 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(34,34,34,1)]">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 px-2 hover:opacity-80 transition-opacity">
          <div className="bg-bmc-yellow rounded-full p-2 border border-bmc-dark">
            <Coffee className="w-5 h-5 text-bmc-dark" />
          </div>
          <span className="font-black text-xl tracking-tight text-bmc-dark hidden sm:block">utkarsh.praiseboard</span>
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-bold text-slate-600 hover:text-bmc-dark transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex bg-white rounded-full p-1 border border-bmc-dark">
            <button className="px-3 py-1 rounded-full text-xs font-bold text-slate-400 hover:text-bmc-dark">DE</button>
            <button className="px-3 py-1 rounded-full bg-bmc-dark text-white text-xs font-bold">EN</button>
          </div>
          <Link href="#demo" className="bg-bmc-yellow text-bmc-dark font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full border border-bmc-dark hover:bg-yellow-400 transition-colors">
            Start Tipping
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
