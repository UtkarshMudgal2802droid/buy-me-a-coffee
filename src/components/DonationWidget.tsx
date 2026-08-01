"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Hexagon, Loader2 } from 'lucide-react';

export default function DonationWidget() {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(3);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const amounts = [1, 3, 5];

  const handleTip = async () => {
    setIsProcessing(true);
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  const currentEthAmount = selectedAmount === 'custom' ? customAmount : (selectedAmount * 0.005).toFixed(3);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, type: "spring" }}
      className="glass-card p-6 md:p-10 sticky top-32 w-full max-w-md mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <Hexagon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Support Creator</h2>
      </div>

      <div className="space-y-8">
        {/* Coffee Selector */}
        <div>
          <label className="text-[10px] text-slate-400 font-bold mb-4 block uppercase tracking-[0.2em]">Select Amount</label>
          <div className="grid grid-cols-4 gap-2">
            {amounts.map((amount) => (
              <motion.button
                key={amount}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAmount(amount)}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 ${
                  selectedAmount === amount
                    ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-black/30 border-white/10 text-slate-400 hover:bg-black/50 hover:border-white/30'
                }`}
              >
                {amount} <Coffee className="w-4 h-4" />
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAmount('custom')}
              className={`py-3 rounded-xl border font-semibold text-sm transition-all duration-300 ${
                selectedAmount === 'custom'
                  ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-black/30 border-white/10 text-slate-400 hover:bg-black/50 hover:border-white/30'
              }`}
            >
              Custom
            </motion.button>
          </div>
        </div>

        {/* Custom ETH Input */}
        <AnimatePresence>
          {selectedAmount === 'custom' && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="relative group">
                <input
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="glass-input w-full pl-16 text-xl font-bold group-hover:border-neon-cyan/30 focus:border-neon-cyan/50 focus:ring-neon-cyan/30"
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neon-cyan font-bold tracking-widest text-sm">ETH</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Input */}
        <div>
          <label className="text-[10px] text-slate-400 font-bold mb-4 block uppercase tracking-[0.2em]">Message (Optional)</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="You are doing great work..."
            className="glass-input w-full resize-none text-sm"
          />
        </div>

        {/* Total & Submit */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 font-bold text-sm tracking-widest uppercase">Total</span>
            <span className="text-xl font-black text-neon-amber drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">{currentEthAmount || '0.00'} ETH</span>
          </div>
          <button
            onClick={handleTip}
            disabled={isProcessing || (selectedAmount === 'custom' && !customAmount)}
            className="glow-btn w-full py-4 text-sm tracking-widest uppercase disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Send Tip'
            )}
          </button>
          
          <p className="text-center text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-6 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>
            Ethereum Network Connected
          </p>
        </div>
      </div>
    </motion.div>
  );
}
