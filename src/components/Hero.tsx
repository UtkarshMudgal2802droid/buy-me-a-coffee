"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Hero3D from './Hero3D';

export default function Hero() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const wordVars = {
    hidden: { y: "100%", opacity: 0 },
    show: { 
      y: "0%", 
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center mt-20 pt-20">
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

        {/* Hand-drawn accent */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: -15 }}
          transition={{ delay: 0.8 }}
          className="absolute -top-12 -left-12 sm:-left-24 text-bmc-yellow font-bold rotate-[-15deg]"
        >
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 38C15.5 28.5 45.5 8 58 2M58 2C52 4.5 45.5 6.5 40 8M58 2C55.5 8 52 16.5 49 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Staggered Hero Headline */}
        <motion.h1 
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-bmc-dark flex flex-wrap justify-center gap-x-4 overflow-hidden"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {["Support", "your", "local", "transit"].map((word, i) => (
            <motion.span key={i} variants={wordVars} className="inline-block relative">
              {word}
            </motion.span>
          ))}
          <br className="hidden md:block w-full" />
          <motion.span 
            variants={wordVars} 
            className="inline-block"
          >
            hero with a coffee.
          </motion.span>
        </motion.h1>

        {/* Hand-drawn accent 2 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 15 }}
          transition={{ delay: 1 }}
          className="absolute top-1/2 -right-8 sm:-right-32 text-bmc-dark font-bold font-serif italic text-xl"
        >
          <div className="relative">
            Keep the
            <br />
            buses running
            <svg className="absolute -bottom-10 right-0 text-bmc-dark" width="40" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2C15.5 11.5 45.5 32 58 38M58 38C52 35.5 45.5 33.5 40 32M58 38C55.5 32 52 23.5 49 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg text-slate-600 max-w-xl mb-12 font-medium"
        >
          Accept ETH directly to your wallet. No platform fees, no censorship, just pure peer-to-peer support powered by smart contracts. Help creators like Ifeoma keep their city moving.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center relative z-20"
        >
          <motion.a whileTap={{ scale: 0.95 }} href="#demo" className="relative z-10">
            <span className="bmc-btn text-lg">
              Support Ifeoma
            </span>
          </motion.a>
          
          <div className="absolute -bottom-12 -left-16 rotate-[-15deg] font-serif italic text-bmc-dark">
            Zero fees!
            <svg className="absolute -top-4 -right-8" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 28C12 18 25 5 28 2M28 2C24 4 19 6 15 8M28 2C26 6 23 11 20 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </div>

      </div>

      {/* Interactive Cursor Glow Background */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[100px] opacity-60 z-0"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          backgroundColor: ["#10b981", "#ffdd00", "#ff2a85", "#10b981"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}
