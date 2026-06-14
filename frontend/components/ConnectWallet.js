'use client';
import { useState, useEffect, useCallback } from 'react';
import { connectWallet } from '../lib/contract';
import { HiOutlineLink, HiOutlineLogout } from 'react-icons/hi';
import toast from 'react-hot-toast';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

function truncateAddress(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ConnectWallet() {
  const [address, setAddress] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [connecting, setConnecting] = useState(false);

  const checkNetwork = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId === SEPOLIA_CHAIN_ID) {
        setNetworkName('Sepolia');
      } else {
        setNetworkName('Wrong Network');
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleConnect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('Vui lòng cài đặt MetaMask!');
      return;
    }

    setConnecting(true);
    try {
      const { address: addr } = await connectWallet();
      setAddress(addr);
      await checkNetwork();
      toast.success('Đã kết nối ví thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Kết nối ví thất bại');
    } finally {
      setConnecting(false);
    }
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      setNetworkName('Sepolia');
      toast.success('Đã chuyển sang mạng Sepolia');
    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: 'Sepolia Testnet',
              nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          });
        } catch {
          toast.error('Không thể thêm mạng Sepolia');
        }
      } else {
        toast.error('Không thể chuyển mạng');
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    // Check if already connected
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          checkNetwork();
        }
      })
      .catch(() => {});

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAddress(null);
        setNetworkName('');
      } else {
        setAddress(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      checkNetwork();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [checkNetwork]);

  if (!address) {
    return (
      <button className="btn btn-primary btn-sm" onClick={handleConnect} disabled={connecting}>
        {connecting ? (
          <>
            <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
            Đang kết nối...
          </>
        ) : (
          <>
            <HiOutlineLink />
            Kết nối ví
          </>
        )}
      </button>
    );
  }

  const handleDisconnect = () => {
    setAddress(null);
    setNetworkName('');
    toast.success('Đã ngắt kết nối ví');
    // Reload page to reset all states
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {networkName && networkName !== 'Sepolia' && (
        <button className="btn btn-danger btn-sm" onClick={switchToSepolia}>
          Sai mạng
        </button>
      )}
      {networkName === 'Sepolia' && (
        <span className="badge badge-success">Sepolia</span>
      )}
      <span
        className="badge badge-primary"
        style={{ fontSize: '13px', padding: '6px 12px', cursor: 'default' }}
        title={address}
      >
        {truncateAddress(address)}
      </span>
      <button
        className="btn btn-ghost btn-sm"
        onClick={handleDisconnect}
        title="Ngắt kết nối ví"
        style={{ padding: '4px 8px', minWidth: 'auto', fontSize: '14px' }}
      >
        <HiOutlineLogout />
      </button>
    </div>
  );
}
