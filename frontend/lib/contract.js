import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

const CONTRACT_ABI = [
  // === V1 Functions ===
  "function mint(address to, string memory uri) external returns (uint256)",
  "function batchMint(address[] calldata recipients, string[] calldata uris) external returns (uint256[])",
  "function revoke(uint256 tokenId) external",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
  "function tokensOfOwner(address owner) external view returns (uint256[])",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function exists(uint256 tokenId) external view returns (bool)",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function MINTER_ROLE() external view returns (bytes32)",
  "function totalSupply() external view returns (uint256)",

  // === V2 Request Functions ===
  "function createRequest(address student, string memory uri) external returns (uint256)",
  "function createBatchRequests(address[] calldata students, string[] calldata uris) external returns (uint256[])",
  "function confirmAndMint(uint256 requestId) external payable",
  "function rejectRequest(uint256 requestId, string calldata reason) external",
  "function cancelRequest(uint256 requestId) external",
  "function cleanExpired(uint256 requestId) external",

  // === V2 View Functions ===
  "function requests(uint256 requestId) external view returns (address student, string metadataURI, uint256 createdAt, uint256 expiresAt, uint8 status, uint256 tokenId, string rejectionReason)",
  "function requestCount() external view returns (uint256)",
  "function getStudentRequests(address student) external view returns (uint256[])",
  "function getPendingRequests(address student) external view returns (uint256[])",
  "function getStats() external view returns (uint256 _totalSupply, uint256 _totalRevenue, uint256 _requestCount, uint256 _pendingCount)",
  "function treasury() external view returns (address)",
  "function totalRevenue() external view returns (uint256)",
  "function MINT_FEE() external view returns (uint256)",
  "function REQUEST_DURATION() external view returns (uint256)",
  "function setTreasury(address _treasury) external",

  // === Events ===
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event RequestCreated(uint256 indexed requestId, address indexed student, string uri, uint256 expiresAt)",
  "event RequestConfirmed(uint256 indexed requestId, address indexed student, uint256 tokenId, uint256 fee)",
  "event RequestRejected(uint256 indexed requestId, address indexed student, string reason)",
  "event RequestCancelled(uint256 indexed requestId)",
  "event RequestExpired(uint256 indexed requestId)"
];

/// Mint fee constant for frontend display
export const MINT_FEE_ETH = "0.3";

/**
 * Returns an ethers BrowserProvider connected to MetaMask
 */
export function getProvider() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not found. Please install MetaMask browser extension.');
  }
  return new ethers.BrowserProvider(window.ethereum);
}

/**
 * Returns a read-only provider using Alchemy RPC (always Sepolia)
 */
export function getReadProvider() {
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  if (alchemyKey) {
    return new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`);
  }
  return new ethers.JsonRpcProvider('https://rpc.sepolia.org');
}

/**
 * Returns a signer from the connected wallet
 */
export async function getSigner() {
  const provider = getProvider();
  return provider.getSigner();
}

/**
 * Returns a contract instance connected to the given signer or provider
 */
export function getContract(signerOrProvider) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local');
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

/**
 * Connects MetaMask wallet and returns the address, provider, and signer
 */
export async function connectWallet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not found');
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });

  const provider = getProvider();
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { address, provider, signer };
}

/**
 * Checks if the given address has the MINTER_ROLE on the contract
 */
export async function checkIsAdmin(address) {
  try {
    const provider = getReadProvider();
    const contract = getContract(provider);
    const minterRole = await contract.MINTER_ROLE();
    return contract.hasRole(minterRole, address);
  } catch (err) {
    console.error('Error checking admin role:', err);
    return false;
  }
}

/**
 * Request status enum mapping
 */
export const RequestStatus = {
  0: 'PENDING',
  1: 'CONFIRMED',
  2: 'EXPIRED',
  3: 'REJECTED',
  4: 'CANCELLED',
  PENDING: 0,
  CONFIRMED: 1,
  EXPIRED: 2,
  REJECTED: 3,
  CANCELLED: 4,
};
