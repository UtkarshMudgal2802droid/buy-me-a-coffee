"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Loader2, MessageSquareQuote, Coffee, ArrowUpDown, Filter, AlertCircle, RefreshCw, Wallet, ServerCrash, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract-config';

const SEPOLIA_CHAIN_ID = '0xaa36a7';

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
  
  const [hasMetaMask, setHasMetaMask] = useState(true);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [rpcError, setRpcError] = useState(false);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const filterRef = React.useRef<HTMLDivElement>(null);
  const sortRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkNetworkAndWallet = async () => {
    if (!window.ethereum) {
      setHasMetaMask(false);
      setLoading(false);
      return false;
    }
    setHasMetaMask(true);
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        setIsWrongNetwork(true);
        setLoading(false);
        return false;
      }
      setIsWrongNetwork(false);
      return true;
    } catch (e) {
      console.error("Could not check network", e);
      return false;
    }
  };

  const fetchPastTips = async () => {
    const isReady = await checkNetworkAndWallet();
    if (!isReady) return null;

    try {
      setLoading(true);
      setRpcError(false);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const currentBlock = await provider.getBlockNumber();
      // Use a smaller block range (e.g. 5000) to avoid "service temporarily unavailable" RPC rate limits on free tiers
      const fromBlock = Math.max(0, currentBlock - 5000);

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
      setRpcError(true);
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

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (contract) {
        contract.removeAllListeners("TipReceived");
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



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

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia test network',
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                nativeCurrency: { name: 'SepoliaETH', symbol: 'SEP', decimals: 18 },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding network", addError);
        }
      } else {
        console.error("Error switching network", error);
      }
    }
  };

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
            
            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                disabled={loading || !hasMetaMask || isWrongNetwork || rpcError}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-colors font-bold text-sm disabled:opacity-50 ${filterMode !== 'all' ? 'bg-bmc-yellow border-bmc-dark text-bmc-dark shadow-[2px_2px_0px_0px_rgba(34,34,34,1)]' : 'border-slate-200 text-slate-500 hover:text-bmc-dark hover:border-bmc-dark'}`}
              >
                <Filter className="w-4 h-4" />
                {filterMode === 'all' ? 'Filter' : filterMode === 'has_note' ? 'Messages' : 'Large Tips'}
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white border-2 border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="flex flex-col py-1">
                      <button onClick={() => { setFilterMode('all'); setIsFilterOpen(false); }} className={`px-4 py-3 text-left text-sm font-bold transition-colors ${filterMode === 'all' ? 'text-bmc-dark bg-bmc-yellow/20' : 'text-slate-500 hover:bg-slate-50 hover:text-bmc-dark'}`}>All Coffees</button>
                      <button onClick={() => { setFilterMode('has_note'); setIsFilterOpen(false); }} className={`px-4 py-3 text-left text-sm font-bold transition-colors ${filterMode === 'has_note' ? 'text-bmc-dark bg-bmc-yellow/20' : 'text-slate-500 hover:bg-slate-50 hover:text-bmc-dark'}`}>With Messages Only</button>
                      <button onClick={() => { setFilterMode('large_only'); setIsFilterOpen(false); }} className={`px-4 py-3 text-left text-sm font-bold transition-colors ${filterMode === 'large_only' ? 'text-bmc-dark bg-bmc-yellow/20' : 'text-slate-500 hover:bg-slate-50 hover:text-bmc-dark'}`}>Large Tips (≥0.01 ETH)</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                disabled={loading || !hasMetaMask || isWrongNetwork || rpcError}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-colors font-bold text-sm disabled:opacity-50 ${sortOrder !== 'newest' ? 'bg-bmc-yellow border-bmc-dark text-bmc-dark shadow-[2px_2px_0px_0px_rgba(34,34,34,1)]' : 'border-slate-200 text-slate-500 hover:text-bmc-dark hover:border-bmc-dark'}`}
              >
                <ArrowUpDown className="w-4 h-4" />
                {sortOrder === 'newest' ? 'Newest' : sortOrder === 'oldest' ? 'Oldest' : sortOrder === 'highest' ? 'Highest' : 'Lowest'}
                <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white border-2 border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="flex flex-col py-1">
                      <button onClick={() => { setSortOrder('newest'); setIsSortOpen(false); }} className={`px-4 py-3 text-left text-sm font-bold transition-colors ${sortOrder === 'newest' ? 'text-bmc-dark bg-bmc-yellow/20' : 'text-slate-500 hover:bg-slate-50 hover:text-bmc-dark'}`}>Newest First</button>
                      <button onClick={() => { setSortOrder('oldest'); setIsSortOpen(false); }} className={`px-4 py-3 text-left text-sm font-bold transition-colors ${sortOrder === 'oldest' ? 'text-bmc-dark bg-bmc-yellow/20' : 'text-slate-500 hover:bg-slate-50 hover:text-bmc-dark'}`}>Oldest First</button>
                      <button onClick={() => { setSortOrder('highest'); setIsSortOpen(false); }} className={`px-4 py-3 text-left text-sm font-bold transition-colors ${sortOrder === 'highest' ? 'text-bmc-dark bg-bmc-yellow/20' : 'text-slate-500 hover:bg-slate-50 hover:text-bmc-dark'}`}>Highest Amount</button>
                      <button onClick={() => { setSortOrder('lowest'); setIsSortOpen(false); }} className={`px-4 py-3 text-left text-sm font-bold transition-colors ${sortOrder === 'lowest' ? 'text-bmc-dark bg-bmc-yellow/20' : 'text-slate-500 hover:bg-slate-50 hover:text-bmc-dark'}`}>Lowest Amount</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Ledger...</p>
          </div>
        ) : !hasMetaMask ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <Wallet className="w-12 h-12 text-slate-400 mb-4" />
            <p className="text-slate-600 font-bold text-lg mb-2">MetaMask is missing</p>
            <p className="text-slate-400 max-w-sm mb-6">You need a Web3 wallet like MetaMask installed to view the blockchain ledger.</p>
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="bmc-btn text-sm py-3 px-6">
              Install MetaMask
            </a>
          </div>
        ) : isWrongNetwork ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-red-200 rounded-3xl bg-red-50/50">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-red-600 font-bold text-lg mb-2">Wrong Network Connected</p>
            <p className="text-red-400 max-w-sm mb-6">Please switch your wallet to the Sepolia test network to view these transactions.</p>
            <button onClick={switchNetwork} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center gap-2 transition-colors">
              <RefreshCw className="w-4 h-4" /> Switch to Sepolia
            </button>
          </div>
        ) : rpcError ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-amber-200 rounded-3xl bg-amber-50/50">
            <ServerCrash className="w-12 h-12 text-amber-400 mb-4" />
            <p className="text-amber-700 font-bold text-lg mb-2">Network Congested</p>
            <p className="text-amber-600/80 max-w-sm mb-6">The blockchain RPC service is temporarily unavailable or rate-limited. Please try again.</p>
            <button onClick={() => fetchPastTips()} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center gap-2 transition-colors">
              <RefreshCw className="w-4 h-4" /> Retry Connection
            </button>
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
