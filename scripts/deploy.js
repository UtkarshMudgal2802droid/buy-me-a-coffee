import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Starting deployment...");

  const PraiseBoard = await hre.ethers.getContractFactory("PraiseBoard");
  const board = await PraiseBoard.deploy();
  
  await board.waitForDeployment();
  
  const address = await board.getAddress();
  console.log(`PraiseBoard deployed to: ${address}`);

  // Update the .env file with the new contract address
  const envPath = path.join(__dirname, "..", ".env");
  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
    // Replace existing NEXT_PUBLIC_CONTRACT_ADDRESS or append it
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${address}`;
    }
  } else {
    envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}\n`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log(`Saved contract address to .env`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
