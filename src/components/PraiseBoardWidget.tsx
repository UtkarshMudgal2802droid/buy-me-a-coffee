"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// We will inject the contract address here later after deployment
const CONTRACT_ADDRESS = "0x0FaebD0cfA6f15CA041e304111C3590d3B6C3b2b";

const ABI = [
  "function tip(string note) payable",
  "event TipReceived(address indexed sender, uint256 amount, string note)"
];

type Tip = {
  sender: string;
  amount: string;
  note: string;
  txHash: string;
};

export default function PraiseBoard() {
  const [account, setAccount] = useState<string>('');
  const [network, setNetwork] = useState<string>('');
  
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
    if (account && CONTRACT_ADDRESS) {
      fetchPastTips();
      setupEventListener();
    }
  }, [account]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatusMsg("MetaMask is not installed.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const network = await provider.getNetwork();
      setNetwork(network.name);
      
      // Auto switch to Sepolia
      if (network.chainId !== 11155111n) {
        try {
          await provider.send("wallet_switchEthereumChain", [{ chainId: "0xaa36a7" }]);
          setNetwork("sepolia");
        } catch (switchError) {
          console.error(switchError);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPastTips = async () => {
    if (!window.ethereum || !CONTRACT_ADDRESS) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 9000);

      // The supporter wall is populated from decoded event logs
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
    }
  };

  const setupEventListener = async () => {
    if (!window.ethereum || !CONTRACT_ADDRESS) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    
    contract.on("TipReceived", (sender, amount, note, event) => {
      console.log("New tip received live!");
      const newTip = {
        sender,
        amount: ethers.formatEther(amount),
        note,
        txHash: event.log.transactionHash
      };
      setTips(prev => [newTip, ...prev]);
    });
  };

  const sendTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.ethereum || !account) return;
    if (note.length > 256) {
      setStatusMsg("Note is too long.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMsg("Please confirm in MetaMask...");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.tip(note, { value: ethers.parseEther(amount || "0") });
      setStatusMsg(`Transaction sent! Waiting for confirmation...`);
      
      // The receipt status is inspected after the transaction resolves
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setStatusMsg("Tip sent successfully!");
        setAmount('');
        setNote('');
        await fetchPastTips();
      } else {
        setStatusMsg("Transaction reverted by the network.");
      }
      
    } catch (error: any) {
      console.error(error);
      // A rejected wallet prompt has its own branch
      if (error.code === 4001 || error.message.includes("user rejected transaction")) {
        setStatusMsg("You rejected the transaction in MetaMask.");
      } else {
        setStatusMsg("An error occurred. Transaction failed.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-electric-purple via-cyber-blue to-warm-amber drop-shadow-md"
          >
            The Praise Board
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {!account ? (
              <button onClick={connectWallet} className="cyber-button px-8 py-3">
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <div className="w-2 h-2 rounded-full bg-emerald-accent shadow-[0_0_8px_rgba(16,185,129,1)] animate-pulse"></div>
                <span className="font-mono text-sm tracking-widest text-slate-300">
                  {account.slice(0, 6)}...{account.slice(-4)} <span className="text-cyber-blue ml-2">({network})</span>
                </span>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Send Tip Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="glass-card p-8 sticky top-32">
              <h2 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-3">
                Support Ifeoma
              </h2>
              <form onSubmit={sendTip} className="space-y-6">
                <div className="relative group">
                  <label className="block text-xs mb-3 text-slate-400 font-bold uppercase tracking-widest">Amount</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="glass-input w-full pl-16 text-xl font-bold bg-black/60 focus:bg-black group-hover:border-electric-purple/30 focus:border-electric-purple/50 focus:ring-electric-purple/30"
                    placeholder="0.01"
                  />
                  <span className="absolute left-5 top-[2.4rem] text-electric-purple font-black tracking-widest">ETH</span>
                </div>
                <div className="relative group">
                  <label className="block text-xs mb-3 text-slate-400 font-bold uppercase tracking-widest">Note (Max 256 chars)</label>
                  <textarea 
                    required
                    maxLength={256}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="glass-input w-full resize-none bg-black/60 focus:bg-black group-hover:border-cyber-blue/30 focus:border-cyber-blue/50 focus:ring-cyber-blue/30"
                    placeholder="Thanks for the bus timetables!"
                    rows={4}
                  />
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  disabled={isProcessing || !account}
                  className="cyber-button w-full py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Send Tip & Note'
                  )}
                </motion.button>
                {statusMsg && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm text-center font-bold mt-4 ${statusMsg.includes('success') ? 'text-emerald-accent drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-warm-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}
                  >
                    {statusMsg}
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>

          {/* Supporter Wall */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="glass-panel p-8 rounded-3xl min-h-[600px] h-full">
              <h2 className="text-2xl font-black mb-8 tracking-tight">Wall of Supporters</h2>
              
              {!account ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 rounded-full bg-electric-purple/10 border border-electric-purple/20 flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-electric-purple animate-spin" />
                  </div>
                  <p className="text-slate-400 font-medium">Please connect your wallet to view live tips.</p>
                </div>
              ) : tips.length === 0 ? (
                <p className="text-slate-400 font-medium text-center mt-20">No tips have been sent yet. Be the first!</p>
              ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  {tips.map((tip, i) => (
                    <motion.div 
                      key={tip.txHash + i}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", delay: i * 0.1 }}
                      className="group relative overflow-hidden bg-black/40 hover:bg-black/60 border border-white/5 hover:border-electric-purple/30 p-6 rounded-2xl transition-all duration-300 shadow-lg"
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-electric-purple/10 to-cyber-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-purple to-cyber-blue flex items-center justify-center font-bold shadow-[0_0_15px_rgba(147,51,234,0.4)]">
                            {tip.sender.slice(2, 4).toUpperCase()}
                          </div>
                          <span className="font-mono text-sm text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            {tip.sender.slice(0, 6)}...{tip.sender.slice(-4)}
                          </span>
                        </div>
                        <span className="font-black text-xl text-warm-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                          {tip.amount} ETH
                        </span>
                      </div>
                      
                      <p className="text-slate-200 text-lg leading-relaxed relative z-10 font-light pl-13">
                        "{tip.note}"
                      </p>
                      
                      <div className="mt-4 text-right relative z-10">
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${tip.txHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-cyber-blue transition-colors"
                        >
                          View Receipt ↗
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
