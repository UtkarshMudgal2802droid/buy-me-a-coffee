"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

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
      
      // The supporter wall is populated from decoded event logs
      const filter = contract.filters.TipReceived();
      const events = await contract.queryFilter(filter);
      
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-purple to-warm-amber">The Praise Board</h1>
          {!account ? (
            <button onClick={connectWallet} className="px-6 py-2 bg-electric-purple text-white rounded-lg font-bold hover:bg-electric-purple/80 transition">
              Connect Wallet
            </button>
          ) : (
            <div className="text-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
              Connected: {account.slice(0, 6)}...{account.slice(-4)} ({network})
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Send Tip Section */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-6">Support Ifeoma</h2>
            <form onSubmit={sendTip} className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-slate-400">Amount (ETH)</label>
                <input 
                  type="number" 
                  step="0.0001"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-electric-purple"
                  placeholder="0.01"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-slate-400">Note (Max 256 chars)</label>
                <textarea 
                  required
                  maxLength={256}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-electric-purple"
                  placeholder="Thanks for the bus timetables!"
                  rows={3}
                />
              </div>
              <button 
                type="submit" 
                disabled={isProcessing || !account}
                className="w-full bg-gradient-to-r from-electric-purple to-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
                {isProcessing ? 'Processing...' : 'Send Tip & Note'}
              </button>
              {statusMsg && <p className="text-sm text-center text-warm-amber mt-4">{statusMsg}</p>}
            </form>
          </div>

          {/* Supporter Wall */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Wall of Supporters</h2>
            {tips.length === 0 ? (
              <p className="text-slate-400 italic">No tips yet or connect wallet to view.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {tips.map((tip, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-emerald-accent bg-emerald-accent/10 px-2 py-1 rounded">
                        {tip.sender.slice(0, 6)}...{tip.sender.slice(-4)}
                      </span>
                      <span className="font-bold text-warm-amber">{tip.amount} ETH</span>
                    </div>
                    <p className="text-slate-300">"{tip.note}"</p>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${tip.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-white mt-3 inline-block"
                    >
                      View on Etherscan ↗
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
