"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Hero Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter text-slate-900 drop-shadow-sm"
        >
          Fund the Future of <br className="hidden md:block" />
          <span className="text-wild-gradient drop-shadow-[0_10px_20px_rgba(255,42,133,0.3)]">Decentralized Art.</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl mb-14 font-bold"
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
          <a 
            href="#demo"
            className="glow-btn px-10 py-5 w-full sm:w-auto uppercase tracking-widest"
          >
            Explore the Deck <ArrowRight className="w-5 h-5 ml-2 inline" />
          </a>
          
          <a 
            href="#demo"
            className="outline-glow-btn px-10 py-5 w-full sm:w-auto uppercase tracking-widest"
          >
            Open Ledger
          </a>
        </motion.div>
      </div>
    </div>
  );
}
