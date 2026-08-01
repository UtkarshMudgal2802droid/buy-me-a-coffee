"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function HybridFeatureCards() {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center relative">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Powered By Web3
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          A truly decentralized experience built with modern technologies to empower creators.
        </p>
      </motion.div>

      {/* The Custom Hybrid Uiverse Cards */}
      <div className="hybrid-wrap">
        
        <div className="hybrid-card">
          <div className="hybrid-content">
            <span className="text-9xl font-black absolute inset-0 flex items-center justify-center opacity-5 text-white/50 tracking-tighter mix-blend-overlay pointer-events-none">X</span>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="66"
              width="66"
              className="mb-4 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="url(#gradient-amber)"
                d="M12.3999 17.4999C11.8999 17.2999 11.2999 17.3999 11.0999 17.8999L9.29989 21.4999C8.99989 21.9999 9.19989 22.5999 9.69989 22.8999C9.79989 22.9999 9.99989 22.9999 10.1999 22.9999C10.5999 22.9999 10.8999 22.7999 11.0999 22.4999L12.8999 18.8999C13.0999 18.2999 12.8999 17.6999 12.3999 17.4999Z"
              ></path>
              <path
                fill="url(#gradient-amber)"
                d="M17 17.4999C16.5 17.2999 15.9 17.3999 15.7 17.8999L13.9 21.4999C13.7 21.9999 13.8 22.5999 14.3 22.7999C14.4 22.8999 14.6 22.8999 14.8 22.8999C15.2 22.8999 15.5 22.6999 15.7 22.3999L17.5 18.7999C17.7 18.2999 17.5 17.6999 17 17.4999Z"
              ></path>
              <path
                fill="url(#gradient-amber)"
                d="M7.89994 17.4999C7.39994 17.2999 6.79994 17.3999 6.59994 17.8999L4.79994 21.4999C4.59994 21.9999 4.69994 22.5999 5.19994 22.7999C5.29994 22.9999 5.49994 22.9999 5.59994 22.9999C5.99994 22.9999 6.29994 22.7999 6.49994 22.4999L8.29994 18.8999C8.59994 18.2999 8.39994 17.6999 7.89994 17.4999Z"
              ></path>
              <path
                fill="url(#gradient-amber)"
                d="M15.2 1C12.4 1 9.9 2.5 8.5 4.8C8 4.7 7.5 4.6 7 4.6C3.7 4.6 1 7.3 1 10.6C1 13.9 3.7 16.6 7 16.6H15.2C19.5 16.6 23 13.1 23 8.8C23 4.5 19.5 1 15.2 1Z"
              ></path>
            </svg>
            <h3 className="text-xl font-bold mt-4 mb-1">Decentralized</h3>
            <p className="text-sm text-slate-400 text-center px-4">No middlemen taking a cut of your earnings.</p>
          </div>
        </div>

        <div className="hybrid-card">
          <div className="hybrid-content">
            <span className="text-9xl font-black absolute inset-0 flex items-center justify-center opacity-5 text-white/50 tracking-tighter mix-blend-overlay pointer-events-none">Y</span>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="66"
              width="66"
              className="mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="url(#gradient-blue)"
                d="M12.2999 22.0001C9.59992 22.0001 6.99992 21.0001 4.99992 19.0001C0.999923 15.0001 0.999923 8.70009 4.89992 4.80009C6.29992 3.30009 8.19992 2.30009 10.2999 2.00009C10.6999 1.90009 11.0999 2.10009 11.2999 2.50009C11.4999 2.90009 11.4999 3.30009 11.1999 3.60009C8.99992 6.10009 9.19992 10.0001 11.5999 12.4001C13.9999 14.8001 17.7999 15.0001 20.2999 12.8001C20.5999 12.5001 21.0999 12.5001 21.3999 12.7001C21.7999 12.9001 21.9999 13.3001 21.8999 13.7001C21.5999 15.8001 20.5999 17.6001 19.1999 19.1001C17.2999 21.0001 14.7999 22.0001 12.2999 22.0001Z"
              ></path>
            </svg>
            <h3 className="text-xl font-bold mt-4 mb-1">Secure</h3>
            <p className="text-sm text-slate-400 text-center px-4">Powered by immutable smart contracts.</p>
          </div>
        </div>

        <div className="hybrid-card">
          <div className="hybrid-content">
            <span className="text-9xl font-black absolute inset-0 flex items-center justify-center opacity-5 text-white/50 tracking-tighter mix-blend-overlay pointer-events-none">Z</span>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              height="66"
              width="66"
              className="mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="url(#gradient-emerald)"
                d="M8.49995 22.9999C8.19995 22.9999 7.89995 22.8999 7.59995 22.7999C6.79995 22.3999 6.39995 21.5999 6.59995 20.7999L7.79995 14.9999H5.99995C5.19995 14.9999 4.49995 14.4999 4.19995 13.7999C3.89995 13.0999 3.99995 12.2999 4.59995 11.7999L14.0999 1.6999C14.6999 1.0999 15.6999 0.899901 16.3999 1.2999C17.1999 1.6999 17.5999 2.4999 17.3999 3.2999L16.1999 9.0999H17.9999C18.7999 9.0999 19.4999 9.5999 19.7999 10.2999C20.0999 10.9999 19.9999 11.7999 19.3999 12.2999L9.89995 22.3999C9.49995 22.7999 8.99995 22.9999 8.49995 22.9999Z"
              ></path>
            </svg>
            <h3 className="text-xl font-bold mt-4 mb-1">Instant</h3>
            <p className="text-sm text-slate-400 text-center px-4">Funds sent directly to your wallet in seconds.</p>
          </div>
        </div>

        {/* Global SVG Gradients for Icons */}
        <svg style={{ visibility: 'hidden', width: 0, height: 0, position: 'absolute' }}>
          <defs>
            <linearGradient id="gradient-amber" x1="0%" y1="0%" x2="120%" y2="120%">
              <stop offset="0%" stopColor="#f59e0b"></stop>
              <stop offset="100%" stopColor="#ef4444"></stop>
            </linearGradient>
            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="120%" y2="120%">
              <stop offset="0%" stopColor="#3b82f6"></stop>
              <stop offset="100%" stopColor="#8b5cf6"></stop>
            </linearGradient>
            <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="120%" y2="120%">
              <stop offset="0%" stopColor="#10b981"></stop>
              <stop offset="100%" stopColor="#3b82f6"></stop>
            </linearGradient>
          </defs>
        </svg>

      </div>
    </div>
  );
}
