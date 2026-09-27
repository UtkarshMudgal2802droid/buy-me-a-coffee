"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ShieldAlert, Loader2, LogOut, CheckCircle2 } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract-config';

const SEPOLIA_CHAIN_ID = '0xaa36a7';

export default function WithdrawWidget() {
  const [account, setAccount] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txStatus, setTxStatus] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [ownerAddress, setOwnerAddress] = useState<string>('');

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Connection error:", error);
      }
    }
  };

  const loadContractData = async () => {
    try {
      // Use public RPC to read data without requiring connected wallet
      const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const balance = await provider.getBalance(CONTRACT_ADDRESS);
      setContractBalance(ethers.formatEther(balance));
      
      // We assume owner is readable if public. If not, we handle errors gracefully during execution.
      // Let's try to read owner if it's public:
      try {
        const owner = await contract.owner();
        setOwnerAddress(owner.toLowerCase());
      } catch (e) {
        console.warn("Owner getter not public or not found");
      }
    } catch (error) {
      console.error("Failed to load contract data:", error);
    }
  };

  useEffect(() => {
    checkConnection();
    loadContractData();

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
      (window as any).ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    // Poll for balance updates
    const interval = setInterval(loadContractData, 15000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 7000);
  };

  const handleWithdraw = async () => {
    if (!account) {
      showNotification('error', 'Please connect your wallet first.');
      return;
    }

    setIsProcessing(true);
    setTxStatus('Requesting Withdrawal...');
    
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      
      // Ensure on correct network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(11155111)) {
        showNotification('error', 'Please switch to the Sepolia Network.');
        setIsProcessing(false);
        return;
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.withdraw();
      
      setTxStatus('Awaiting Confirmation...');
      const receipt = await tx.wait();
      
      if (receipt.status === 0) {
        throw new Error("Transaction reverted by the EVM");
      }
      
      showNotification('success', 'Funds successfully withdrawn to your wallet!');
      await loadContractData();
    } catch (error: any) {
      console.error(error);
      
      // Edge Case 1: User rejected
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        showNotification('error', 'Withdrawal cancelled by user.');
      } 
      // Edge Case 2: Not Owner (Execution Reverted)
      else if (error.message.includes('Only owner can withdraw') || error.message.includes('reverted')) {
        showNotification('error', 'ACCESS DENIED: Only the contract owner can withdraw funds.');
      }
      // Edge Case 3: No funds
      else if (error.message.includes('No funds')) {
        showNotification('error', 'The contract balance is currently zero.');
      }
      // Fallback
      else {
        showNotification('error', 'Transaction failed. You may not be the authorized owner.');
      }
    } finally {
      setIsProcessing(false);
      setTxStatus('');
    }
  };

  const isOwner = account && ownerAddress && account.toLowerCase() === ownerAddress;

  return (
    <div className="w-full max-w-4xl mx-auto my-20 p-8 border border-slate-200 rounded-xl bg-slate-50/50 shadow-sm relative overflow-hidden">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`absolute top-6 left-1/2 z-50 px-6 py-3 rounded-md font-medium text-sm shadow-md flex items-center gap-2 ${
              notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
              'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {notification.type === 'error' ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-400" /> Administrative Controls
          </h3>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">
            Total funds secured in contract: <strong className="text-slate-700">{parseFloat(contractBalance).toFixed(4)} ETH</strong>. 
            Withdrawal operations are strictly restricted at the cryptographic level. Only the deployer's wallet signature can authorize extraction.
          </p>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={isProcessing || !account}
          className={`flex items-center justify-center gap-2 px-8 py-3 rounded-md font-semibold transition-all ${
            isOwner
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              : 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm'
          } disabled:opacity-50`}
        >
          {isProcessing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing</>
          ) : (
            <><LogOut className="w-4 h-4" /> Secure Withdraw</>
          )}
        </button>
      </div>

      {!account && (
        <p className="text-xs text-slate-400 mt-4 text-right flex items-center justify-end gap-1">
          <Wallet className="w-3 h-3" /> Connect wallet to access admin functions
        </p>
      )}
    </div>
  );
}
