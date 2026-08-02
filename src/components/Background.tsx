"use client";

import { motion } from 'framer-motion';

export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 pointer-events-none">


      {/* Futuristic Glowing Orbs */}
      <motion.div 
        animate={{ y: [0, -50, 0], opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ y: [0, 50, 0], opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[10%] right-[5%] w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[150px]"
      />
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[40%] right-[40%] w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[100px]"
      />
    </div>
  );
}
