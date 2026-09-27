"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Loader2, LogOut, CheckCircle2 } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract-config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EthereumWindow = { ethereum?: any };

export default function WithdrawWidget() {
  const [account, setAccount] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [ownerAddress, setOwnerAddress] = useState<string>('');

  const checkConnection = async () => {
    const win = window as unknown as EthereumWindow;
    if (typeof window !== 'undefined' && win.ethereum) {
      try {
        const accounts = await win.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch {
        // Connection error silently ignored in production
      }
    }
  };

  const loadContractData = async () => {
    try {
      // Use strictly environment variable RPC
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL as string;
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const balance = await provider.getBalance(CONTRACT_ADDRESS);
      setContractBalance(ethers.formatEther(balance));
      
      // We assume owner is readable if public. If not, we handle errors gracefully during execution.
      // Let's try to read owner if it's public:
      try {
        const owner = await contract.owner();
        setOwnerAddress(owner.toLowerCase());
      } catch {
        // Owner getter not public or not found, ignored
      }
    } catch {
      // Failed to load contract data, handled by UI state
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkConnection();
      await loadContractData();
    };
    init();

    const win = window as unknown as EthereumWindow;
    if (typeof window !== 'undefined' && win.ethereum) {
      win.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
      win.ethereum.on('chainChanged', () => {
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
    
    try {
      const win = window as unknown as EthereumWindow;
      const provider = new ethers.BrowserProvider(win.ethereum);
      
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
      
      const receipt = await tx.wait();
      
      if (receipt.status === 0) {
        throw new Error("Transaction reverted by the EVM");
      }
      
      showNotification('success', 'Funds successfully withdrawn to your wallet!');
      await loadContractData();
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      
      // Edge Case 1: User rejected
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        showNotification('error', 'Withdrawal cancelled by user.');
      } 
      // Edge Case 2: MetaMask Busy (Pending Transaction)
      else if (err.code === -32002 || (err.message && err.message.toLowerCase().includes('pending'))) {
        showNotification('error', 'MetaMask is busy. Please complete or cancel your pending transaction first.');
      }
      // Edge Case 3: No funds in contract
      else if (err.message && err.message.includes('No funds')) {
        showNotification('error', 'The contract balance is currently zero.');
      }
      // Edge Case 4: Insufficient funds for gas
      else if (err.code === 'INSUFFICIENT_FUNDS' || (err.message && err.message.toLowerCase().includes('insufficient funds'))) {
        showNotification('error', 'You do not have enough ETH to cover the gas fee for this transaction.');
      }
      // Edge Case 5: Not Owner (Execution Reverted)
      else if (err.message && (err.message.includes('Only owner can withdraw') || err.message.includes('reverted'))) {
        showNotification('error', 'ACCESS DENIED: Only the contract owner can withdraw funds.');
      }
      // Fallback
      else {
        showNotification('error', 'Transaction failed. Please check MetaMask for details.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isOwner = account && ownerAddress && account.toLowerCase() === ownerAddress;

  // Secret Admin Mode: Only render the component if the connected wallet is the owner
  if (!isOwner) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-20">
      <div className="glass-card p-10 flex flex-col relative overflow-hidden">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className={`absolute top-6 left-1/2 z-50 px-6 py-3 rounded-xl font-bold shadow-lg text-center max-w-[90%] md:max-w-md w-max flex flex-col md:flex-row items-center justify-center gap-2 ${
                notification.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 
                'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              {notification.type === 'error' ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div>
            <h3 className="text-3xl font-black text-bmc-dark tracking-tight flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-400 border-2 border-emerald-700 text-emerald-900 shadow-[4px_4px_0px_0px_rgba(4,120,87,1)]">
                <ShieldAlert className="w-6 h-6" />
              </div>
              Creator Dashboard
            </h3>
            <p className="text-slate-600 font-medium mt-4 max-w-lg leading-relaxed">
              Total funds secured in contract: <strong className="text-bmc-dark font-black text-lg">{parseFloat(contractBalance).toFixed(4)} ETH</strong>. 
              <br/>Withdrawal operations are strictly restricted. Only the contract owner can extract funds.
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWithdraw}
            disabled={isProcessing || !account}
            className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950 border-2 border-emerald-700 shadow-[4px_4px_0px_0px_rgba(4,120,87,1)] rounded-full px-8 py-4 font-black transition-all hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(4,120,87,1)] disabled:opacity-50 flex items-center gap-3"
          >
            {isProcessing ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Processing</>
            ) : (
              <><LogOut className="w-6 h-6" /> Secure Withdraw</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
