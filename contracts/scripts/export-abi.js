/**
 * Export ABI Script
 * 
 * Extracts the ABI array from the Hardhat artifact and saves it
 * as a clean JSON file for frontend consumption.
 */
const fs = require("fs");
const path = require("path");

const ARTIFACT_PATH = path.join(
  __dirname,
  "../artifacts/contracts/SoulboundDegree.sol/SoulboundDegree.json"
);

const OUTPUT_DIR = path.join(__dirname, "../contracts/abi");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "SoulboundDegree.json");

function main() {
  // Check if artifact exists
  if (!fs.existsSync(ARTIFACT_PATH)) {
    console.error("❌ Artifact not found. Run 'npx hardhat compile' first.");
    process.exit(1);
  }

  // Read artifact
  const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, "utf8"));

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write clean ABI (only the abi array)
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(artifact.abi, null, 2));

  console.log(`✅ ABI exported to: ${OUTPUT_PATH}`);
  console.log(`   ${artifact.abi.length} entries in ABI`);
}

main();
