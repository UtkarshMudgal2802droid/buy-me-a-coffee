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
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [filterMode, setFilterMode] = useState<'all' | 'has_note' | 'large_only'>('all');

  const fetchPastTips = async () => {
    if (!window.ethereum) {
      setLoading(false);
      return null;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 9000);

      const filter = contract.filters.TipReceived();
      const events = await contract.queryFilter(filter, fromBlock, "latest");
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsedTips = events.map((event: any) => ({
        sender: event.args.sender,
        amount: ethers.formatEther(event.args.amount),
        note: event.args.note,
        txHash: event.transactionHash
      })).reverse(); // Reverse makes it 'newest' by default
      
      setTips(parsedTips);
      return contract;
    } catch (error) {
      console.error("Error fetching tips:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let contract: ethers.Contract | null = null;
    
    const setup = async () => {
      contract = await fetchPastTips();
      if (contract) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        contract.on("TipReceived", (sender: any, amount: any, note: any, event: any) => {
          const newTip = {
            sender,
            amount: ethers.formatEther(amount),
            note,
            txHash: event.log.transactionHash
          };
          setTips(prev => {
            if (prev.some(t => t.txHash === newTip.txHash)) return prev;
            return [newTip, ...prev];
          });
        });
      }
    };
    setup();

    return () => {
      if (contract) {
        contract.removeAllListeners("TipReceived");
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cycleFilter = () => {
    if (filterMode === 'all') setFilterMode('has_note');
    else if (filterMode === 'has_note') setFilterMode('large_only');
    else setFilterMode('all');
  };

  const cycleSort = () => {
    if (sortOrder === 'newest') setSortOrder('highest');
    else if (sortOrder === 'highest') setSortOrder('lowest');
    else if (sortOrder === 'lowest') setSortOrder('oldest');
    else setSortOrder('newest');
  };

  // We copy the tips to avoid mutating the original fetched array during sorting
  const displayedTips = [...tips]
    .filter((tip) => {
      if (filterMode === 'has_note') return tip.note.trim().length > 0;
      if (filterMode === 'large_only') return parseFloat(tip.amount) >= 0.01;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'highest') return parseFloat(b.amount) - parseFloat(a.amount);
      if (sortOrder === 'lowest') return parseFloat(a.amount) - parseFloat(b.amount);
      return 0; // fallback, handles 'newest' naturally since array is already newest-first
    });

  if (sortOrder === 'oldest') {
    displayedTips.reverse();
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-20">
      <div className="glass-card p-10 flex flex-col">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="text-3xl font-black tracking-tight text-bmc-dark flex items-center gap-4">
            <div className="p-3 rounded-full bg-bmc-yellow border-2 border-bmc-dark text-bmc-dark shadow-[4px_4px_0px_0px_rgba(34,34,34,1)]">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            Recent Coffees {creatorName && `for ${creatorName.split(' ')[0]}`}
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={cycleFilter}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-colors font-bold text-sm ${filterMode !== 'all' ? 'bg-bmc-yellow border-bmc-dark text-bmc-dark shadow-[2px_2px_0px_0px_rgba(34,34,34,1)]' : 'border-slate-200 text-slate-500 hover:text-bmc-dark hover:border-bmc-dark'}`}
            >
              <Filter className="w-4 h-4" />
              {filterMode === 'all' ? 'Filter: All' : filterMode === 'has_note' ? 'Filter: Messages' : 'Filter: Large Tips'}
            </button>
            <button 
              onClick={cycleSort}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-colors font-bold text-sm ${sortOrder !== 'newest' ? 'bg-bmc-yellow border-bmc-dark text-bmc-dark shadow-[2px_2px_0px_0px_rgba(34,34,34,1)]' : 'border-slate-200 text-slate-500 hover:text-bmc-dark hover:border-bmc-dark'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === 'newest' ? 'Newest' : sortOrder === 'oldest' ? 'Oldest' : sortOrder === 'highest' ? 'Highest Amount' : 'Lowest Amount'}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Ledger...</p>
          </div>
        ) : displayedTips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 rounded-3xl">
            <Coffee className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium text-lg">No coffees yet.</p>
            <p className="text-slate-400 mt-1">Be the first to support this creator!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayedTips.map((tip, i) => (
              <motion.div 
                key={tip.txHash + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", delay: i * 0.1 }}
                className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-bmc-yellow hover:shadow-[4px_4px_0px_0px_rgba(255,221,0,1)] transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-sm font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                    {tip.sender.slice(0, 6)}...{tip.sender.slice(-4)}
                  </span>
                  <span className="font-black text-xl text-bmc-dark flex items-center gap-2">
                    {tip.amount} ETH <Coffee className="w-5 h-5 text-bmc-dark" />
                  </span>
                </div>
                
                <p className="text-slate-700 text-lg leading-relaxed font-medium italic mb-6">
                  &quot;{tip.note}&quot;
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
