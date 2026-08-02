"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Hexagon, Loader2 } from 'lucide-react';

export default function DonationWidget() {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(3);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Convert coffee amount to ETH (1 coffee = 0.005 ETH for demo)
  const ethPerCoffee = 0.005;
  const currentEthAmount = selectedAmount === 'custom' 
    ? (parseFloat(customAmount) * ethPerCoffee || 0).toFixed(3)
    : (selectedAmount * ethPerCoffee).toFixed(3);

  const handleTip = async () => {
    setIsProcessing(true);
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="glass-card w-full h-full p-10 flex flex-col relative overflow-hidden"
    >
      
      {/* Soft Animated Background Orbs */}
      <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-blue-300 opacity-10 blur-3xl mix-blend-multiply"></div>

      <motion.div variants={itemVars} className="flex items-center gap-5 mb-10 relative z-10">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shadow-sm">
          <Coffee className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Support Cause</h2>
      </motion.div>

      <motion.div variants={itemVars} className="mb-8 relative z-10">
        <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">
          Select Amount
        </label>
        <div className="flex gap-3">
          {[1, 3, 5].map((amount) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`flex-1 py-3 rounded-full border-2 font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-sm ${
                selectedAmount === amount
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                  : 'border-slate-100 bg-white text-slate-600 hover:border-emerald-200'
              }`}
            >
              {amount} <Coffee className="w-4 h-4" />
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAmount('custom')}
            className={`flex-1 py-3 rounded-full border-2 font-bold transition-all duration-300 hover:-translate-y-0.5 shadow-sm ${
              selectedAmount === 'custom'
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200'
            }`}
          >
            Custom
          </motion.button>
        </div>

        <AnimatePresence>
          {selectedAmount === 'custom' && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <input
                type="number"
                placeholder="Number of coffees..."
                className="w-full glass-input"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="1"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVars} className="mb-10 relative z-10">
        <label className="block text-xs uppercase tracking-widest font-black text-slate-500 mb-4">
          Message (Optional)
        </label>
        <textarea
          placeholder="You are doing great work..."
          className="w-full glass-input min-h-[100px] resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </motion.div>

      <motion.div variants={itemVars} className="mt-auto relative z-10">
        <div className="flex justify-between items-end mb-6">
          <span className="text-slate-500 font-black text-lg tracking-widest uppercase">Total</span>
          <span className="text-3xl font-black text-[#ff6a00] drop-shadow-md">{currentEthAmount || '0.00'} ETH</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleTip}
          disabled={isProcessing || (selectedAmount === 'custom' && !customAmount)}
          className="glow-btn w-full py-5 text-xl tracking-widest uppercase disabled:opacity-50 flex justify-center items-center gap-3 pointer-events-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing...
            </>
          ) : (
            'Send Tip'
          )}
        </motion.button>
        
        <p className="text-center text-xs uppercase tracking-widest font-black text-slate-400 mt-6 flex items-center justify-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.8)] animate-pulse"></span>
          Ethereum Network Connected
        </p>
      </motion.div>
    </motion.div>
  );
}
