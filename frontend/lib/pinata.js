const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs';

/**
 * Uploads a file to Pinata via our API route proxy
 * @param {File} file - The file to upload
 * @returns {{ ipfsHash: string, ipfsUrl: string }}
 */
export async function uploadFileToPinata(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload-file', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload file to IPFS');
  }

  return res.json();
}

/**
 * Uploads JSON metadata to Pinata via our API route proxy
 * @param {Object} jsonData - The JSON object to upload
 * @returns {{ ipfsHash: string, ipfsUrl: string }}
 */
export async function uploadJSONToPinata(jsonData) {
  const res = await fetch('/api/upload-json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload JSON to IPFS');
  }

  return res.json();
}

/**
 * Fetches JSON data from IPFS given a hash or URI
 * @param {string} ipfsHashOrUri - The IPFS hash (Qm...) or ipfs:// URI
 * @returns {Object} The parsed JSON data
 */
export async function fetchFromIPFS(ipfsHashOrUri) {
  const url = getIPFSUrl(ipfsHashOrUri);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch from IPFS: ${res.status}`);
  }

  return res.json();
}

/**
 * Converts an IPFS hash or ipfs:// URI to an HTTPS gateway URL
 * @param {string} hashOrUri - IPFS hash or ipfs:// URI
 * @returns {string} HTTPS gateway URL
 */
export function getIPFSUrl(hashOrUri) {
  if (!hashOrUri) return '';

  // Already an http(s) URL
  if (hashOrUri.startsWith('http://') || hashOrUri.startsWith('https://')) {
    return hashOrUri;
  }

  // ipfs:// protocol
  if (hashOrUri.startsWith('ipfs://')) {
    const hash = hashOrUri.replace('ipfs://', '');
    return `${PINATA_GATEWAY}/${hash}`;
  }

  // Raw hash
  return `${PINATA_GATEWAY}/${hashOrUri}`;
}
