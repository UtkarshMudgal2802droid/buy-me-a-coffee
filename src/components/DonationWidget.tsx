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
    <div className="w-full h-full glass-card p-10 flex flex-col justify-between">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-3xl bg-[#00e5ff]/10 border-2 border-[#00e5ff]/30 text-[#00e5ff] shadow-[0_10px_25px_rgba(0,229,255,0.3)]">
          <Hexagon className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900">Support Creator</h2>
      </div>

      <div className="space-y-8 flex-1">
        {/* Coffee Selector */}
        <div>
          <label className="text-sm text-slate-500 font-black mb-4 block uppercase tracking-widest">Select Amount</label>
          <div className="grid grid-cols-4 gap-3">
            {amounts.map((amount) => (
              <motion.button
                key={amount}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedAmount(amount)}
                className={`py-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-lg transition-all duration-300 ${
                  selectedAmount === amount
                    ? 'bg-[#ff2a85] border-[#ff2a85] text-white shadow-[0_10px_20px_rgba(255,42,133,0.4)] scale-105'
                    : 'bg-white/50 border-white/80 text-slate-600 hover:bg-white hover:border-[#ff2a85]/50 hover:shadow-md'
                }`}
              >
                {amount} <Coffee className="w-5 h-5" />
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedAmount('custom')}
              className={`py-4 rounded-2xl border-2 font-black text-lg transition-all duration-300 ${
                selectedAmount === 'custom'
                  ? 'bg-[#8a2be2] border-[#8a2be2] text-white shadow-[0_10px_20px_rgba(138,43,226,0.4)] scale-105'
                  : 'bg-white/50 border-white/80 text-slate-600 hover:bg-white hover:border-[#8a2be2]/50 hover:shadow-md'
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
                  className="glass-input w-full pl-20 text-2xl"
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8a2be2] font-black tracking-widest text-lg">ETH</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Input */}
        <div>
          <label className="text-sm text-slate-500 font-black mb-4 block uppercase tracking-widest">Message (Optional)</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="You are doing great work..."
            className="glass-input w-full resize-none text-lg"
          />
        </div>
      </div>

      {/* Total & Submit */}
      <div className="pt-8 border-t-4 border-white/40 mt-auto">
        <div className="flex justify-between items-center mb-8">
          <span className="text-slate-500 font-black text-lg tracking-widest uppercase">Total</span>
          <span className="text-3xl font-black text-[#ff6a00] drop-shadow-md">{currentEthAmount || '0.00'} ETH</span>
        </div>
        <MagneticButton>
          <button
            onClick={handleTip}
            disabled={isProcessing || (selectedAmount === 'custom' && !customAmount)}
            className="glow-btn w-full py-5 text-xl tracking-widest uppercase disabled:opacity-50 flex justify-center items-center gap-3 pointer-events-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              'Send Tip'
            )}
          </button>
        </MagneticButton>
        
        <p className="text-center text-xs uppercase tracking-widest font-black text-slate-400 mt-6 flex items-center justify-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.8)] animate-pulse"></span>
          Ethereum Network Connected
        </p>
      </div>
    </div>
  );
}
