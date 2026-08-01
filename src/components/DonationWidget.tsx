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
        <div className="p-3 rounded-2xl bg-electric-purple/10 border border-electric-purple/30 text-electric-purple shadow-[0_0_15px_rgba(147,51,234,0.3)]">
          <Hexagon className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Tip in Crypto</h2>
      </div>

      <div className="space-y-8">
        {/* Coffee Selector */}
        <div>
          <label className="text-sm text-slate-400 font-bold mb-4 block uppercase tracking-wider">Select Amount</label>
          <div className="grid grid-cols-4 gap-3">
            {amounts.map((amount) => (
              <motion.button
                key={amount}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedAmount(amount)}
                className={`py-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold text-lg transition-all duration-300 ${
                  selectedAmount === amount
                    ? 'bg-electric-purple/20 border-electric-purple text-electric-purple shadow-[0_0_20px_rgba(147,51,234,0.4)] scale-105'
                    : 'bg-black/30 border-white/10 text-slate-400 hover:bg-black/50 hover:border-white/30'
                }`}
              >
                {amount} <Coffee className="w-5 h-5" />
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedAmount('custom')}
              className={`py-4 rounded-2xl border-2 font-bold text-sm transition-all duration-300 ${
                selectedAmount === 'custom'
                  ? 'bg-cyber-blue/20 border-cyber-blue text-cyber-blue shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105'
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
                  className="glass-input w-full pl-16 text-xl font-bold bg-black/60 focus:bg-black group-hover:border-cyber-blue/30 focus:border-cyber-blue/50 focus:ring-cyber-blue/30"
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-cyber-blue font-black tracking-widest">ETH</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Input */}
        <div>
          <label className="text-sm text-slate-400 font-bold mb-4 block uppercase tracking-wider">Leave a message (Optional)</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="You are doing great work..."
            className="glass-input w-full resize-none bg-black/40 focus:bg-black"
          />
        </div>

        {/* Total & Submit */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 font-bold">Total</span>
            <span className="text-2xl font-black text-warm-amber drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">{currentEthAmount || '0.00'} ETH</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleTip}
            disabled={isProcessing || (selectedAmount === 'custom' && !customAmount)}
            className="cyber-button w-full py-5 text-xl disabled:opacity-50 flex items-center justify-center gap-3"
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
          
          <p className="text-center text-sm font-bold text-slate-500 mt-6 flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-accent shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse"></span>
            Ethereum Network Connected
          </p>
        </div>
      </div>
    </motion.div>
  );
}
