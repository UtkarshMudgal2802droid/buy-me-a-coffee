<div align="center">
  <h1>PraiseBoard</h1>
  <p>
    <strong>Decentralized Commuter Support Protocol</strong>
  </p>
</div>

<hr />

## Overview

PraiseBoard is a decentralized financial application designed to facilitate direct, peer-to-peer microtransactions between civic service maintainers and daily commuters. By leveraging Ethereum smart contracts on the Sepolia network, the system eliminates intermediaries, processing fees, and centralized data silos.

The protocol ensures that 100% of the funds transferred by users are routed directly to the designated recipient's contract address. Support messages (notes) are encoded directly into transaction event logs, enabling a mathematically verifiable and immutable public ledger of supporters.

## Architecture

The system is separated into three distinct architectural layers:

1. **Client Interface:** Built with Next.js, React, and TailwindCSS. Incorporates Framer Motion and Three.js for hardware-accelerated user interactions.
2. **Web3 Connectivity:** Utilizes `ethers.js` v6 for remote procedure call (RPC) communication, network validation, and transaction signing.
3. **Smart Contract:** Written in Solidity and deployed via Hardhat. Employs OpenZeppelin's ReentrancyGuard for security against reentrancy vectors.

## Protocol Security & Implementation

The repository is built to satisfy strict security requirements:

- **Access Control:** The withdrawal function is strictly governed by `msg.sender == owner`, ensuring that only the deployer's cryptographic signature can authorize the extraction of funds. Any unauthorized attempt will revert immediately.
- **Data Boundaries:** String inputs for transaction notes are clamped at 256 bytes at the EVM level to prevent deliberate state bloat.
- **Event Integrity:** Transaction value and sender identity are derived exclusively from `msg.value` and `msg.sender` during the transaction execution, rendering spoofing mathematically impossible.
- **Reentrancy Protection:** Critical state-changing functions are isolated using the CEI (Checks-Effects-Interactions) pattern and guarded via OpenZeppelin's non-reentrant modifier.

## Technical Specifications

- **Contract Address:** [`0x9bABC0CE0a9f63E267C2DF2271e0c8642398c35f`](https://sepolia.etherscan.io/address/0x9bABC0CE0a9f63E267C2DF2271e0c8642398c35f)
- **Network:** Sepolia Testnet (Chain ID: 11155111)
- **Node Environment:** Node.js v18.x or higher
- **Package Manager:** npm or yarn

## Environment Setup

Create a `.env.local` file in the root directory and supply your QuickNode RPC URL and deployer private key:

```env
NEXT_PUBLIC_RPC_URL=https://<your-quicknode-endpoint-url>
NEXT_PUBLIC_CONTRACT_ADDRESS=0x9bABC0CE0a9f63E267C2DF2271e0c8642398c35f
PRIVATE_KEY=<your-wallet-private-key>
```

## Local Deployment Instructions

To execute the application locally:

1. Install module dependencies:
   ```bash
   npm install
   ```

2. Initialize the local development server:
   ```bash
   npm run dev
   ```

3. Access the local environment:
   Navigate to `http://localhost:3000` in a Web3-enabled browser.

## Error Handling

The application features comprehensive edge-case management:
- **Network Validation:** Automatically detects incorrect network states and requests a switch to Sepolia via EIP-3326.
- **Rejection Capture:** Identifies and gracefully handles EIP-1193 user rejections (`Error 4001`).
- **Transaction Reversion:** Monitors transaction receipts to capture and display EVM-level execution failures.

<hr />
<div align="center">
  <sub>Engineered for reliability and transparency.</sub>
</div>
