"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
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
    <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-purple/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      {/* Floating 3D Element Placeholder */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-32 right-1/4 w-32 h-32 hidden lg:flex items-center justify-center bg-gradient-to-br from-electric-purple/40 to-blue-600/40 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(147,51,234,0.5)] -z-10"
      >
        <span className="text-6xl text-white font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">Ξ</span>
      </motion.div>

      <div className="container mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-electric-purple font-semibold text-sm mb-8"
        >
          <Sparkles className="w-4 h-4" />
          The Web3 Creator Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight"
        >
          Fund the Future of <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-purple via-fuchsia-500 to-warm-amber">
            Decentralized Art.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
        >
          Accept ETH directly to your wallet. No platform fees, no censorship, just pure peer-to-peer support.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/creator">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cyber-button px-8 py-4 bg-white text-slate-950 flex items-center gap-2 text-lg w-full sm:w-auto justify-center"
            >
              View Creator Demo <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 glass-card text-white hover:bg-white/10 transition-colors font-bold text-lg w-full sm:w-auto"
          >
            Connect Wallet
          </motion.button>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-0 w-full overflow-hidden py-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex w-[200%] animate-marquee">
          <div className="flex w-1/2 justify-around items-center">
            {recentTips.map((tip, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300 font-medium whitespace-nowrap px-8">
                <span className="w-2 h-2 rounded-full bg-emerald-accent shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <span className="text-white">{tip.name}</span> tipped <span className="text-warm-amber">{tip.amount}</span>
              </div>
            ))}
          </div>
          <div className="flex w-1/2 justify-around items-center">
            {recentTips.map((tip, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-2 text-slate-300 font-medium whitespace-nowrap px-8">
                <span className="w-2 h-2 rounded-full bg-emerald-accent shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <span className="text-white">{tip.name}</span> tipped <span className="text-warm-amber">{tip.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
