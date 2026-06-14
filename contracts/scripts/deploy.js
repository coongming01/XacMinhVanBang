const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("=".repeat(60));
  console.log("  Deploying SoulboundDegreeV2 Contract");
  console.log("=".repeat(60));
  console.log(`  Network:  ${hre.network.name}`);
  console.log(`  Deployer: ${deployer.address}`);
  console.log(`  Balance:  ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} ETH`);
  console.log("-".repeat(60));

  // Use deployer as both admin and treasury (same wallet)
  const treasuryAddress = deployer.address;

  // Deploy V2 with admin and treasury
  const SoulboundDegreeV2 = await hre.ethers.getContractFactory("SoulboundDegreeV2");
  const contract = await SoulboundDegreeV2.deploy(deployer.address, treasuryAddress);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("");
  console.log("  ✅ Contract V2 deployed successfully!");
  console.log(`  📍 Contract Address: ${contractAddress}`);
  console.log(`  👤 Admin Address:    ${deployer.address}`);
  console.log(`  🏦 Treasury Address: ${treasuryAddress}`);
  console.log(`  💰 Mint Fee:         0.3 ETH`);
  console.log(`  ⏰ Request Duration: 30 days`);
  console.log(`  🌐 Network:         ${hre.network.name}`);
  console.log("");
  console.log("-".repeat(60));
  console.log("  Update your frontend .env.local:");
  console.log(`  NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("");
  console.log("  Verify on Etherscan:");
  console.log(`  npx hardhat verify --network ${hre.network.name} ${contractAddress} ${deployer.address} ${treasuryAddress}`);
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
