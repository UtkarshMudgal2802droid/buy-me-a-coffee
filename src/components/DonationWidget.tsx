"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Loader2, Wallet, AlertCircle, RefreshCw } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract-config';

const SEPOLIA_CHAIN_ID = '0xaa36a7';

export default function DonationWidget({ creatorName = "Buy me a coffee" }: { creatorName?: string }) {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(3);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txStatus, setTxStatus] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  
  // Wallet state
  const [account, setAccount] = useState<string | null>(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(true);

  const checkNetwork = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        setIsWrongNetwork(chainId !== SEPOLIA_CHAIN_ID);
      } catch (e) {
        console.error("Could not check network", e);
      }
    }
  };

  const checkConnection = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setHasMetaMask(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await checkNetwork();
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    } else {
      setHasMetaMask(false);
    }
  };

  // Check if wallet is connected on load and listen to network changes
  useEffect(() => {
    const t = setTimeout(() => { checkConnection(); }, 0);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkNetwork();
        } else {
          setAccount(null);
        }
      });
    }

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const switchNetwork = async () => {
    setIsProcessing(true);
    setTxStatus('Switching Network...');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (window as any).ethereum.request({
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
          showNotification('error', "Failed to add Sepolia network. Please add it manually.");
        }
      } else if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        showNotification('warning', "Network switch was rejected.");
      } else {
        console.error("Error switching network", error);
        showNotification('error', "Failed to switch network.");
      }
    } finally {
      setIsProcessing(false);
      setTxStatus('');
      await checkNetwork();
    }
  };

  const connectWallet = async () => {
    if (!hasMetaMask) {
      showNotification('error', "Please install MetaMask to connect your wallet.");
      return;
    }
    try {
      setIsProcessing(true);
      setTxStatus('Connecting...');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      await checkNetwork();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        showNotification('warning', "Connection request rejected.");
      } else {
        console.error("Error connecting wallet:", error);
        showNotification('error', "Failed to connect wallet.");
      }
    } finally {
      setIsProcessing(false);
      setTxStatus('');
    }
  };

  // Convert coffee amount to ETH (1 coffee = 0.005 ETH for demo)
  const ethPerCoffee = 0.005;
  const currentEthAmount = selectedAmount === 'custom' 
    ? (parseFloat(customAmount) * ethPerCoffee || 0).toFixed(3)
    : ((selectedAmount as number) * ethPerCoffee).toFixed(3);

  const handleTip = async () => {
    if (!hasMetaMask) {
      showNotification('error', "Please install MetaMask to continue.");
      return;
    }
    if (!account) {
      await connectWallet();
      return;
    }
    if (isWrongNetwork) {
      await switchNetwork();
      return;
    }
    
    setIsProcessing(true);
    setTxStatus('Confirming transaction...');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tipAmount = ethers.parseEther(currentEthAmount);
      const note = message || `Coffee for ${creatorName}!`;
      
      // Send transaction
      const tx = await contract.tip(note, { value: tipAmount });
      
      setTxStatus('Waiting for confirmation...');
      // Inspect receipt status (Test 9)
      const receipt = await tx.wait();
      
      if (receipt.status === 0) {
        throw new Error("Transaction reverted by the EVM");
      }
      
      showNotification('success', `Successfully sent ${currentEthAmount} ETH to ${creatorName}!`);
      setMessage('');
      if (selectedAmount === 'custom') setCustomAmount('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Rejected wallet prompt has its own branch (Test 8)
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        showNotification('warning', "Transaction was rejected by the user.");
      } else {
        console.error("Transaction failed:", error);
        showNotification('error', "Transaction failed or wallet is locked.");
      }
    } finally {
      setIsProcessing(false);
      setTxStatus('');
    }
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
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`absolute top-6 left-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-lg whitespace-nowrap flex items-center gap-2 ${
              notification.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 
              notification.type === 'warning' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
              'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}
          >
            {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soft Animated Background Orbs */}
      <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-blue-300 opacity-10 blur-3xl mix-blend-multiply pointer-events-none"></div>

      <motion.div variants={itemVars} className="flex items-center gap-5 mb-10 relative z-10">
        <div className="w-16 h-16 flex-none rounded-full bg-bmc-yellow text-bmc-dark border-2 border-bmc-dark flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(34,34,34,1)]">
          <Coffee className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-bmc-dark tracking-tight leading-tight">Buy {creatorName.split(' ')[0]} a coffee</h2>
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
          maxLength={256}
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
          disabled={isProcessing || (selectedAmount === 'custom' && !customAmount && account !== null && !isWrongNetwork)}
          className={`w-full text-center flex justify-center items-center gap-3 pointer-events-auto disabled:opacity-50 ${account && !isWrongNetwork ? 'bmc-btn' : isWrongNetwork ? 'bg-red-500 text-white border-2 border-red-700 shadow-[4px_4px_0px_0px_rgba(185,28,28,1)] rounded-full px-8 py-4 font-black transition-all hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(185,28,28,1)]' : 'bg-bmc-dark text-white rounded-full py-4 font-bold hover:bg-slate-800 transition-colors'}`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              {txStatus || 'Processing...'}
            </>
          ) : !hasMetaMask ? (
            <>
              <Wallet className="w-5 h-5" /> Install MetaMask
            </>
          ) : !account ? (
            <>
              <Wallet className="w-5 h-5" /> Connect Wallet
            </>
          ) : isWrongNetwork ? (
            <>
              <RefreshCw className="w-5 h-5" /> Switch to Sepolia
            </>
          ) : (
            `Support with ${currentEthAmount} ETH`
          )}
        </motion.button>
        
        <p className="text-center text-xs uppercase tracking-widest font-black text-slate-400 mt-6 flex items-center justify-center gap-2">
          {account && !isWrongNetwork ? (
            <>
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></span>
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </>
          ) : account && isWrongNetwork ? (
            <>
              <span className="w-3 h-3 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)] animate-pulse"></span>
              Wrong Network (Sepolia Required)
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
