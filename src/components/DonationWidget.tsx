"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    // Success handling can be added here
  };

  const currentEthAmount = selectedAmount === 'custom' ? customAmount : (selectedAmount * 0.005).toFixed(3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8 sticky top-8 w-full max-w-md mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-electric-purple/20 text-electric-purple">
          <Hexagon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Tip in Crypto</h2>
      </div>

      <div className="space-y-6">
        {/* Coffee Selector */}
        <div>
          <label className="text-sm text-slate-400 font-medium mb-3 block">Select Amount</label>
          <div className="grid grid-cols-4 gap-3">
            {amounts.map((amount) => (
              <motion.button
                key={amount}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAmount(amount)}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-colors ${
                  selectedAmount === amount
                    ? 'bg-electric-purple/20 border-electric-purple text-electric-purple shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {amount} <Coffee className="w-4 h-4" />
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAmount('custom')}
              className={`py-3 rounded-xl border font-medium transition-colors ${
                selectedAmount === 'custom'
                  ? 'bg-electric-purple/20 border-electric-purple text-electric-purple shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              Custom
            </motion.button>
          </div>
        </div>

        {/* Custom ETH Input */}
        {selectedAmount === 'custom' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="glass-input w-full pl-12"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">ETH</span>
            </div>
          </motion.div>
        )}

        {/* Message Input */}
        <div>
          <label className="text-sm text-slate-400 font-medium mb-3 block">Leave a message (Optional)</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="You are doing great work..."
            className="glass-input w-full resize-none"
          />
        </div>

        {/* Total & Submit */}
        <div className="pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleTip}
            disabled={isProcessing || (selectedAmount === 'custom' && !customAmount)}
            className="cyber-button w-full py-4 bg-gradient-to-r from-electric-purple to-blue-600 text-white flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Tip {currentEthAmount || '0.00'} ETH
              </>
            )}
          </motion.button>
          
          <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-accent shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            Ethereum Network connected
          </p>
        </div>
      </div>
    </motion.div>
  );
}
