"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollTo = (offset: number) => {
    window.scrollTo({ top: offset * window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Subtle Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="px-4 py-1.5 rounded-full border border-[#262626] bg-[#171717]/50 text-xs font-semibold tracking-widest uppercase text-[#e5e5e5] inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f8f9fa] animate-pulse"></span>
            The Web3 Creator Platform
          </div>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter text-[#f8f9fa]"
        >
          Fund the Future of <br className="hidden md:block" />
          <span className="text-[#737373]">Decentralized Art.</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-[#a3a3a3] max-w-2xl mb-12 font-medium"
        >
          Accept ETH directly to your wallet. No platform fees, no censorship, just pure peer-to-peer support powered by smart contracts.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button 
            onClick={() => scrollTo(2)}
            className="sweep-btn px-10 py-4 w-full sm:w-auto text-sm uppercase tracking-widest"
          >
            View Demo <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          
          <button 
            onClick={() => scrollTo(3)}
            className="outline-sweep-btn px-10 py-4 w-full sm:w-auto text-sm uppercase tracking-widest"
          >
            The Ledger
          </button>
        </motion.div>
      </div>
    </div>
  );
}
