"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Hexagon, Loader2, Wallet } from 'lucide-react';

export default function DonationWidget() {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(3);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Wallet state
  const [account, setAccount] = useState<string | null>(null);

  // Check if wallet is connected on load
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        setIsProcessing(true);
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  // Convert coffee amount to ETH (1 coffee = 0.005 ETH for demo)
  const ethPerCoffee = 0.005;
  const currentEthAmount = selectedAmount === 'custom' 
    ? (parseFloat(customAmount) * ethPerCoffee || 0).toFixed(3)
    : ((selectedAmount as number) * ethPerCoffee).toFixed(3);

  const handleTip = async () => {
    if (!account) {
      await connectWallet();
      return;
    }
    
    setIsProcessing(true);
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert(`Successfully sent ${currentEthAmount} ETH!`);
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
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } }
  };

  const options = [1, 3, 5, 'custom'];

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
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shadow-sm">
          <Coffee className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Buy me a coffee</h2>
      </motion.div>

      <motion.div variants={itemVars} className="mb-8 relative z-10">
        <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">
          How many coffees?
        </label>
        
        {/* Telegram-style Segmented Control */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-full relative shadow-inner">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedAmount(option as number | 'custom')}
              className={`flex-1 py-3 relative font-bold text-sm z-10 transition-colors duration-300 flex items-center justify-center gap-2 ${
                selectedAmount === option ? 'text-amber-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {selectedAmount === option && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-200/50"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                {option === 'custom' ? 'Custom' : option} {option !== 'custom' && <Coffee className="w-4 h-4" />}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selectedAmount === 'custom' && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
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
          Say something nice (Optional)
        </label>
        <textarea
          placeholder="Love your videos! Keep it up..."
          className="w-full glass-input min-h-[100px] resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </motion.div>

      <motion.div variants={itemVars} className="mt-auto relative z-10">
        <div className="flex justify-between items-end mb-6">
          <span className="text-slate-500 font-black text-lg tracking-widest uppercase">Total</span>
          <span className="text-3xl font-black text-amber-500 drop-shadow-md">{currentEthAmount || '0.00'} ETH</span>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleTip}
          disabled={isProcessing || (selectedAmount === 'custom' && !customAmount && account !== null)}
          className={`w-full py-5 text-xl tracking-widest uppercase disabled:opacity-50 flex justify-center items-center gap-3 pointer-events-auto rounded-full font-bold text-white shadow-[0_10px_20px_-5px_rgba(245,158,11,0.4)] transition-all duration-300 hover:shadow-[0_15px_25px_-5px_rgba(245,158,11,0.5)] ${account ? 'bg-amber-500 hover:bg-amber-400' : 'bg-slate-800 hover:bg-slate-700 shadow-slate-900/20'}`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Brewing...
            </>
          ) : !account ? (
            <>
              <Wallet className="w-5 h-5" /> Connect Wallet
            </>
          ) : (
            `Support with ${currentEthAmount} ETH`
          )}
        </motion.button>
        
        <p className="text-center text-xs uppercase tracking-widest font-black text-slate-400 mt-6 flex items-center justify-center gap-2">
          {account ? (
            <>
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span>
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </>
          ) : (
            <>
              <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              Wallet Not Connected
            </>
          )}
        </p>
      </motion.div>
    </motion.div>
  );
}
