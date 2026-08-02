"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Loader2, MessageSquareQuote } from 'lucide-react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = "0x0FaebD0cfA6f15CA041e304111C3590d3B6C3b2b";
const ABI = [
  "event TipReceived(address indexed sender, uint256 amount, string note)"
];

type Tip = {
  sender: string;
  amount: string;
  note: string;
  txHash: string;
};

export default function PraiseBoardWidget() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPastTips();
  }, []);

  const fetchPastTips = async () => {
    if (!window.ethereum) {
      setLoading(false);
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 9000);

      const filter = contract.filters.TipReceived();
      const events = await contract.queryFilter(filter, fromBlock, "latest");
      
      const parsedTips = events.map((event: any) => ({
        sender: event.args.sender,
        amount: ethers.formatEther(event.args.amount),
        note: event.args.note,
        txHash: event.transactionHash
      })).reverse();
      
      setTips(parsedTips);
    } catch (error) {
      console.error("Error fetching tips:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-20">
      <div className="glass-card p-10 flex flex-col">
        <h2 className="text-3xl font-black mb-8 tracking-tight text-slate-900 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#ffeb3b]/20 border-2 border-[#ffeb3b]/40 text-[#ff6a00] shadow-sm">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          Recent Supporters
        </h2>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 text-[#ff2a85] animate-spin mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Ledger...</p>
          </div>
        ) : tips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 rounded-3xl border-2 border-white/60 shadow-inner">
            <p className="text-slate-500 font-bold text-lg">Be the first to leave a message on the blockchain!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {tips.map((tip, i) => (
              <motion.div 
                key={tip.txHash + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", delay: i * 0.1 }}
                className="bg-white/70 border-2 border-white/80 hover:border-[#00e5ff]/50 p-6 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-sm font-bold text-[#8a2be2] bg-[#8a2be2]/10 px-3 py-1 rounded-xl">
                    {tip.sender.slice(0, 6)}...{tip.sender.slice(-4)}
                  </span>
                  <span className="font-black text-xl text-[#ff2a85] drop-shadow-sm">
                    {tip.amount} ETH
                  </span>
                </div>
                
                <p className="text-slate-700 text-lg leading-relaxed font-bold italic mb-6">
                  "{tip.note}"
                </p>
                
                <div className="text-right">
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${tip.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#00e5ff] transition-colors"
                  >
                    View Etherscan ↗
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
