"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Loader2, MessageSquareQuote, Coffee, ArrowUpDown, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract-config';

type Tip = {
  sender: string;
  amount: string;
  note: string;
  txHash: string;
};

export default function PraiseBoardWidget({ creatorName = "" }: { creatorName?: string }) {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [filterHasNote, setFilterHasNote] = useState(false);

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
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
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

  const displayedTips = tips
    .filter((tip) => (filterHasNote ? tip.note.trim().length > 0 : true))
    .sort((a, b) => {
      // tips array is inherently 'newest' first because of the .reverse() on fetch
      // If 'oldest', we just reverse the relative order
      return sortOrder === 'newest' ? 0 : -1;
    });

  if (sortOrder === 'oldest') {
    displayedTips.reverse();
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-20">
      <div className="glass-card p-10 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tight text-bmc-dark flex items-center gap-4">
            <div className="p-3 rounded-full bg-bmc-yellow border-2 border-bmc-dark text-bmc-dark shadow-[4px_4px_0px_0px_rgba(34,34,34,1)]">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            Recent Coffees {creatorName && `for ${creatorName.split(' ')[0]}`}
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setFilterHasNote(!filterHasNote)}
              className={`p-2 rounded-full border-2 transition-colors ${filterHasNote ? 'bg-bmc-yellow border-bmc-dark text-bmc-dark shadow-[2px_2px_0px_0px_rgba(34,34,34,1)]' : 'border-slate-200 text-slate-500 hover:text-bmc-dark hover:border-bmc-dark'}`}
              title="Filter by messages"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className={`p-2 rounded-full border-2 transition-colors ${sortOrder === 'oldest' ? 'bg-bmc-yellow border-bmc-dark text-bmc-dark shadow-[2px_2px_0px_0px_rgba(34,34,34,1)]' : 'border-slate-200 text-slate-500 hover:text-bmc-dark hover:border-bmc-dark'}`}
              title={`Sort by: ${sortOrder}`}
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Ledger...</p>
          </div>
        ) : tips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
            <p className="text-slate-500 font-bold text-lg">Be the first to buy a coffee!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {tips.map((tip, i) => (
              <motion.div 
                key={tip.txHash + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", delay: i * 0.1 }}
                className="bg-white border border-slate-100 hover:border-amber-200 p-6 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-sm font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                    {tip.sender.slice(0, 6)}...{tip.sender.slice(-4)}
                  </span>
                  <span className="font-black text-xl text-amber-500 flex items-center gap-2">
                    {tip.amount} ETH <Coffee className="w-5 h-5" />
                  </span>
                </div>
                
                <p className="text-slate-700 text-lg leading-relaxed font-medium italic mb-6">
                  "{tip.note}"
                </p>
                
                <div className="text-right">
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${tip.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors"
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
