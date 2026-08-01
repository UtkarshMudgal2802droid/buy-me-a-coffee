"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    ethereum?: any;
  }
}

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

export default function PraiseBoardWidget() {
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
      if (network.chainId !== BigInt(11155111)) {
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
      setStatusMsg("Confirm in MetaMask...");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.tip(note, { value: ethers.parseEther(amount || "0") });
      setStatusMsg(`Transaction sent! Processing...`);
      
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setStatusMsg("Successfully added to Ledger.");
        setAmount('');
        setNote('');
        await fetchPastTips();
      } else {
        setStatusMsg("Transaction reverted.");
      }
      
    } catch (error: any) {
      console.error(error);
      if (error.code === 4001 || error.message.includes("user rejected transaction")) {
        setStatusMsg("Rejected by user.");
      } else {
        setStatusMsg("Transaction failed.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full text-slate-100 font-sans">
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex-1"></div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {!account ? (
              <button onClick={connectWallet} className="outline-glow-btn px-8 py-3 text-sm tracking-widest uppercase">
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,1)] animate-pulse"></div>
                <span className="font-mono text-xs tracking-widest text-slate-300">
                  {account.slice(0, 6)}...{account.slice(-4)} <span className="text-neon-cyan ml-2">({network})</span>
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
              <h2 className="text-xl font-black mb-8 tracking-tight text-white flex items-center gap-3">
                Write to Ledger
              </h2>
              <form onSubmit={sendTip} className="space-y-6">
                <div className="relative group">
                  <label className="block text-[10px] mb-3 text-slate-400 font-bold uppercase tracking-[0.2em]">Amount</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="glass-input w-full pl-16 text-xl font-bold group-hover:border-neon-purple/30 focus:border-neon-purple/50 focus:ring-neon-purple/30"
                    placeholder="0.01"
                  />
                  <span className="absolute left-5 top-[2.4rem] text-neon-purple font-black tracking-widest text-sm">ETH</span>
                </div>
                <div className="relative group">
                  <label className="block text-[10px] mb-3 text-slate-400 font-bold uppercase tracking-[0.2em]">Note (Max 256 chars)</label>
                  <textarea 
                    required
                    maxLength={256}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="glass-input w-full resize-none group-hover:border-neon-cyan/30 focus:border-neon-cyan/50 focus:ring-neon-cyan/30 text-sm"
                    placeholder="Etch your message into the blockchain..."
                    rows={4}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isProcessing || !account}
                  className="glow-btn w-full py-4 text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Submit Transaction'
                  )}
                </button>
                {statusMsg && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-[10px] uppercase tracking-widest text-center font-bold mt-4 ${statusMsg.includes('Success') || statusMsg.includes('Ledger') ? 'text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-[#f59e0b] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}
                  >
                    {statusMsg}
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>

          {/* Supporter Wall */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="glass-panel p-8 rounded-2xl min-h-[550px] h-full flex flex-col">
              <h2 className="text-xl font-black mb-8 tracking-tight text-white">Ledger History</h2>
              
              {!account ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-4">
                    <Loader2 className="w-5 h-5 text-neon-purple animate-spin" />
                  </div>
                  <p className="text-slate-400 font-medium text-sm">Awaiting Wallet Connection.</p>
                </div>
              ) : tips.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <p className="text-slate-400 font-medium text-sm">No transactions found.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {tips.map((tip, i) => (
                    <motion.div 
                      key={tip.txHash + i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", delay: i * 0.05 }}
                      className="group relative bg-black/40 border border-white/5 hover:border-neon-purple/30 p-6 rounded-xl transition-all duration-300 shadow-lg overflow-hidden"
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                      <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-slate-300 bg-white/5 px-2 py-1 rounded border border-white/10">
                            {tip.sender.slice(0, 6)}...{tip.sender.slice(-4)}
                          </span>
                        </div>
                        <span className="font-bold text-sm text-neon-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                          {tip.amount} ETH
                        </span>
                      </div>
                      
                      <p className="text-slate-300 text-sm leading-relaxed relative z-10 font-normal">
                        "{tip.note}"
                      </p>
                      
                      <div className="mt-4 text-right relative z-10">
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${tip.txHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-neon-cyan transition-colors"
                        >
                          Etherscan ↗
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
