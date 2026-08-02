export const CONTRACT_ADDRESS = "0x466C2fBb2c565e30ceC5d93388531f526f48D752";

export const CONTRACT_ABI = [
  "event TipReceived(address indexed sender, uint256 amount, string note)",
  "function tip(string calldata note) external payable",
  "function withdraw() external nonReentrant",
  "function owner() view returns (address)"
];
