import hre from "hardhat";

async function main() {
  const contract = await hre.ethers.deployContract("PraiseBoard");
  await contract.waitForDeployment();
  console.log(`PraiseBoard deployed to: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
