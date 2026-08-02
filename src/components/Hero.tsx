"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function Hero() {
  // Staggered reveal animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const wordVars = {
    hidden: { y: "150%", rotateZ: 5, opacity: 0 },
    show: { 
      y: "0%", 
      rotateZ: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, mass: 1 }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">

        {/* Staggered Hero Headline */}
        <motion.h1 
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter text-slate-900 drop-shadow-sm flex flex-wrap justify-center gap-x-4 overflow-hidden"
        >
          {["Fund", "the", "Future", "of"].map((word, i) => (
            <motion.span key={i} variants={wordVars} className="inline-block relative">
              {word}
            </motion.span>
          ))}
          <br className="hidden md:block w-full" />
          <motion.span 
            variants={wordVars} 
            className="text-wild-gradient drop-shadow-[0_10px_20px_rgba(255,42,133,0.3)] inline-block mt-2 md:mt-0"
          >
            Decentralized Art.
          </motion.span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl text-slate-600 max-w-2xl mb-14 font-bold"
        >
          Accept ETH directly to your wallet. No platform fees, no censorship, just pure peer-to-peer support powered by smart contracts.
        </motion.p>

        {/* Call to Actions with Magnetic Physics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <MagneticButton as="a" href="#demo">
            <span className="glow-btn px-10 py-5 w-full sm:w-auto uppercase tracking-widest flex items-center justify-center pointer-events-none">
              Explore the Deck <ArrowRight className="w-5 h-5 ml-2 inline" />
            </span>
          </MagneticButton>
          
          <MagneticButton as="a" href="#demo">
            <span className="outline-glow-btn px-10 py-5 w-full sm:w-auto uppercase tracking-widest pointer-events-none">
              Open Ledger
            </span>
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  );
}
