"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Hexagon, Circle } from 'lucide-react';
import Link from 'next/link';

const recentTips = [
  { name: '0x1A4...9F2', amount: '0.05 ETH' },
  { name: 'vitalik.eth', amount: '1.2 ETH' },
  { name: 'CryptoNinja', amount: '0.1 ETH' },
  { name: '0x88B...3C1', amount: '0.02 ETH' },
  { name: 'Web3Fan', amount: '0.5 ETH' },
];

export default function Hero() {
  return (
    <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Floating 3D Elements */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[15%] w-32 h-32 hidden lg:flex items-center justify-center glass-card border-electric-purple/30 bg-electric-purple/10"
      >
        <span className="text-6xl text-white font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">Ξ</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 40, 0], x: [0, 20, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 left-[15%] w-24 h-24 hidden lg:flex items-center justify-center glass-card border-cyber-blue/30 bg-cyber-blue/10 rounded-full"
      >
        <Hexagon className="w-12 h-12 text-cyber-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
      </motion.div>
      
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[30%] w-4 h-4 rounded-full bg-warm-amber shadow-[0_0_20px_rgba(245,158,11,1)]"
      ></motion.div>

      <div className="container mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-card text-white font-bold text-sm mb-12 border-electric-purple/50 bg-electric-purple/10"
        >
          <Sparkles className="w-4 h-4 text-warm-amber" />
          The Web3 Creator Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-6xl md:text-[6rem] font-black tracking-tighter mb-8 leading-[1.1]"
        >
          Fund the Future of <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-purple via-cyber-blue to-warm-amber filter drop-shadow-lg">
            Decentralized Art.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-16 font-light leading-relaxed"
        >
          Accept ETH directly to your wallet. No platform fees, no censorship, just pure peer-to-peer support powered by smart contracts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a href="#demo" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cyber-button px-10 py-5 w-full sm:w-auto text-lg flex items-center justify-center gap-3 group"
            >
              View Creator Demo 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </a>
          <a href="#praise-board" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 glass-card text-white hover:bg-white/10 hover:border-white/20 transition-all font-bold text-lg w-full sm:w-auto"
            >
              Go to Praise Board
            </motion.button>
          </a>
        </motion.div>
      </div>

      {/* Marquee Footer */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden py-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex w-[200%] animate-marquee">
          <div className="flex w-1/2 justify-around items-center">
            {recentTips.map((tip, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300 font-medium whitespace-nowrap px-8">
                <Circle className="w-2 h-2 fill-emerald-accent text-emerald-accent drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-white">{tip.name}</span> tipped <span className="text-warm-amber">{tip.amount}</span>
              </div>
            ))}
          </div>
          <div className="flex w-1/2 justify-around items-center">
            {recentTips.map((tip, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-3 text-slate-300 font-medium whitespace-nowrap px-8">
                <Circle className="w-2 h-2 fill-emerald-accent text-emerald-accent drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-white">{tip.name}</span> tipped <span className="text-warm-amber">{tip.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
