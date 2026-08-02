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
    { name: 'Creators', href: '#demo' }
  ];

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-150%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div className="w-full max-w-6xl bg-white/60 backdrop-blur-md border border-white/80 rounded-full px-3 py-2 flex items-center justify-between shadow-sm">
        
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
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center">
          <a 
            href="#demo"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-slate-900 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-slate-800 transition-colors cursor-pointer shadow-md"
          >
            Start Tipping
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
