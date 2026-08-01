"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import CreatorCard from './CreatorCard';
import DonationWidget from './DonationWidget';
import { MessageSquareQuote } from 'lucide-react';

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

export default function DeckOfCards() {
  const [cards, setCards] = useState<any[]>(['creator', 'donate']);
  const [tips, setTips] = useState<Tip[]>([]);
  
  useEffect(() => {
    fetchPastTips();
  }, []);

  const fetchPastTips = async () => {
    if (!window.ethereum) return;
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

  // Combine static cards and dynamic tip cards
  const allCards = ['creator', 'donate', ...tips];

  const [index, setIndex] = useState(0);

  const nextCard = () => {
    setIndex((prevIndex) => (prevIndex + 1) % allCards.length);
  };

  return (
    <div className="relative w-full max-w-md h-[650px] perspective-1000">
      <AnimatePresence>
        {allCards.map((card, i) => {
          // Calculate relative position in the deck
          // We only want to render a few cards at a time for performance/visuals
          let offset = i - index;
          if (offset < 0) offset += allCards.length;
          
          if (offset > 3) return null; // Only show top 4 cards

          const isTop = offset === 0;

          return (
            <motion.div
              key={typeof card === 'string' ? card : (card as Tip).txHash + i}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
              initial={{ scale: 0.8, y: 100, opacity: 0 }}
              animate={{ 
                scale: 1 - offset * 0.05, 
                y: offset * 30, 
                z: -offset * 100,
                opacity: 1 - offset * 0.2,
                rotateZ: offset === 0 ? 0 : offset % 2 === 0 ? 2 : -2
              }}
              exit={{ scale: 0.8, y: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={isTop ? nextCard : undefined}
              drag={isTop ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y < -100 || offset.y > 100) {
                  nextCard();
                }
              }}
              style={{ zIndex: allCards.length - offset }}
            >
              {card === 'creator' && <CreatorCard />}
              {card === 'donate' && <DonationWidget />}
              {typeof card !== 'string' && (
                <TipCard tip={card as Tip} />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function TipCard({ tip }: { tip: Tip }) {
  return (
    <div className="w-full h-full glass-card p-10 flex flex-col justify-between">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 rounded-3xl bg-[#ffeb3b]/20 border-2 border-[#ffeb3b]/40 text-[#ff6a00] shadow-[0_10px_25px_rgba(255,235,59,0.3)]">
          <MessageSquareQuote className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900">Ledger Tip</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <p className="text-3xl font-black text-slate-700 leading-relaxed italic mb-8">
          "{tip.note}"
        </p>
        
        <div className="bg-white/50 border-2 border-white/80 p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs uppercase tracking-widest font-black text-slate-500">From</span>
            <span className="font-mono text-sm font-bold text-[#8a2be2] bg-[#8a2be2]/10 px-3 py-1 rounded-xl">
              {tip.sender.slice(0, 6)}...{tip.sender.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-widest font-black text-slate-500">Amount</span>
            <span className="text-2xl font-black text-[#ff2a85] drop-shadow-md">
              {tip.amount} ETH
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center pt-8 border-t-4 border-white/40">
        <a 
          href={`https://sepolia.etherscan.io/tx/${tip.txHash}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-black uppercase tracking-widest text-[#00e5ff] hover:text-[#ff2a85] transition-colors inline-flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1"
        >
          View Etherscan Receipt ↗
        </a>
      </div>
    </div>
  );
}
