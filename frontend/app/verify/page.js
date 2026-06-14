'use client';
import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getContract, getProvider, getReadProvider } from '../../lib/contract';
import { fetchFromIPFS, getIPFSUrl } from '../../lib/pinata';
import DegreeCard from '../../components/DegreeCard';
import toast from 'react-hot-toast';
import {
  HiOutlineSearch,
  HiOutlineQrcode,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExternalLink,
} from 'react-icons/hi';

const classifications = {
  xuat_sac: 'Xuất sắc',
  gioi: 'Giỏi',
  kha: 'Khá',
  trung_binh_kha: 'Trung bình khá',
  trung_binh: 'Trung bình',
};

function VerifyPageContent() {
  const [searchAddress, setSearchAddress] = useState('');
  const [searchTokenId, setSearchTokenId] = useState('');
  const [searchMode, setSearchMode] = useState('wallet'); // 'wallet' or 'tokenId'
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // QR Scanner
  const startScanner = async () => {
    setShowScanner(true);

    // Dynamic import to avoid SSR issues
    const { Html5Qrcode } = await import('html5-qrcode');

    // Wait for DOM
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Check if it's an Ethereum address
            const addr = decodedText.match(/0x[a-fA-F0-9]{40}/)?.[0];
            if (addr) {
              setSearchAddress(addr);
              stopScanner();
              handleSearch(addr);
            } else {
              toast.error('QR code không chứa địa chỉ ví hợp lệ');
            }
          },
          () => {} // ignore errors during scanning
        );
      } catch (err) {
        console.error('Scanner error:', err);
        toast.error('Không thể truy cập camera');
        setShowScanner(false);
      }
    }, 100);
  };

  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
    } catch {
      /* ignore */
    }
    setShowScanner(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Auto-search from URL query params (for QR code scanning)
  const searchParams = useSearchParams();
  const autoSearched = useRef(false);

  useEffect(() => {
    if (autoSearched.current) return;

    const walletParam = searchParams.get('wallet');
    const tokenIdParam = searchParams.get('tokenId');

    if (walletParam && walletParam.match(/^0x[a-fA-F0-9]{40}$/)) {
      autoSearched.current = true;
      setSearchMode('wallet');
      setSearchAddress(walletParam);
      // Delay to let state update
      setTimeout(() => handleSearch(walletParam), 300);
    } else if (tokenIdParam && !isNaN(Number(tokenIdParam))) {
      autoSearched.current = true;
      setSearchMode('tokenId');
      setSearchTokenId(tokenIdParam);
      setTimeout(() => {
        handleSearchByTokenIdDirect(tokenIdParam);
      }, 300);
    }
  }, [searchParams]);

  const handleSearch = async (addr) => {
    if (searchMode === 'tokenId') {
      return handleSearchByTokenId();
    }

    const address = addr || searchAddress;
    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Vui lòng nhập địa chỉ ví hợp lệ (0x...)');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const provider = getReadProvider();
      const contract = getContract(provider);

      let tokenIds = [];
      try {
        const ids = await contract.tokensOfOwner(address);
        tokenIds = ids.map((id) => id.toString());
      } catch {
        try {
          const balance = await contract.balanceOf(address);
          const balNum = Number(balance);
          for (let i = 0; i < balNum; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i);
            tokenIds.push(tokenId.toString());
          }
        } catch (e) {
          console.error('Could not load tokens:', e);
        }
      }

      const degreesData = [];
      for (const tokenId of tokenIds) {
        try {
          const uri = await contract.tokenURI(tokenId);
          const metadata = await fetchFromIPFS(uri);
          degreesData.push({ tokenId, metadata });
        } catch (err) {
          console.error(`Error loading token ${tokenId}:`, err);
        }
      }

      setResults(degreesData);

      if (degreesData.length > 0) {
        toast.success(`Tìm thấy ${degreesData.length} văn bằng!`);
      }
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Lỗi khi truy vấn blockchain');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByTokenId = async () => {
    const tokenId = searchTokenId.trim();
    if (!tokenId || isNaN(Number(tokenId)) || Number(tokenId) < 1) {
      toast.error('Vui lòng nhập Token ID hợp lệ (số nguyên dương)');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const provider = getReadProvider();
      const contract = getContract(provider);

      const exists = await contract.exists(tokenId);
      if (!exists) {
        toast.error('Không tìm thấy văn bằng với Token ID này');
        setResults([]);
        return;
      }

      const uri = await contract.tokenURI(tokenId);
      const metadata = await fetchFromIPFS(uri);
      setResults([{ tokenId, metadata }]);
      toast.success('Tìm thấy văn bằng!');
    } catch (err) {
      console.error('Token ID search error:', err);
      toast.error('Không tìm thấy hoặc văn bằng đã bị thu hồi');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Direct search by tokenId param (for URL auto-search)
  const handleSearchByTokenIdDirect = async (tid) => {
    setLoading(true);
    setResults(null);
    try {
      const provider = getReadProvider();
      const contract = getContract(provider);
      const exists = await contract.exists(tid);
      if (!exists) {
        toast.error('Không tìm thấy văn bằng với Token ID này');
        setResults([]);
        return;
      }
      const uri = await contract.tokenURI(tid);
      const metadata = await fetchFromIPFS(uri);
      setResults([{ tokenId: tid, metadata }]);
      toast.success('Tìm thấy văn bằng!');
    } catch (err) {
      console.error('Token ID search error:', err);
      toast.error('Không tìm thấy hoặc văn bằng đã bị thu hồi');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 'var(--space-10)', maxWidth: 650, margin: '0 auto var(--space-10)' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
            🔍 Xác minh văn bằng
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
            Nhập địa chỉ ví hoặc quét mã QR để xác minh văn bằng số trên Blockchain
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div style={{
          maxWidth: 700,
          margin: '0 auto var(--space-4)',
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-2)',
        }}>
          <button
            className={`btn btn-sm ${searchMode === 'wallet' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSearchMode('wallet')}
          >
            🔑 Tìm theo ví
          </button>
          <button
            className={`btn btn-sm ${searchMode === 'tokenId' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setSearchMode('tokenId')}
          >
            🔢 Tìm theo Token ID
          </button>
        </div>

        {/* Search bar */}
        <div style={{
          maxWidth: 700,
          margin: '0 auto var(--space-10)',
        }}>
          <div style={{
            display: 'flex',
            gap: 'var(--space-3)',
            background: 'var(--surface)',
            padding: 'var(--space-2)',
            borderRadius: 'var(--radius-2xl)',
            border: '2px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            transition: 'border-color var(--transition-fast)',
          }}>
            {searchMode === 'wallet' ? (
              <input
                className="form-input"
                type="text"
                placeholder="Nhập địa chỉ ví (0x...)"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  border: 'none',
                  fontSize: 'var(--text-base)',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'transparent',
                }}
              />
            ) : (
              <input
                className="form-input"
                type="number"
                placeholder="Nhập Token ID (ví dụ: 1, 2, 3...)"
                value={searchTokenId}
                onChange={(e) => setSearchTokenId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                min="1"
                style={{
                  border: 'none',
                  fontSize: 'var(--text-base)',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'transparent',
                }}
              />
            )}
            {searchMode === 'wallet' && (
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => showScanner ? stopScanner() : startScanner()}
                title="Quét mã QR"
                style={{ flexShrink: 0 }}
              >
                {showScanner ? <HiOutlineX /> : <HiOutlineQrcode />}
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() => handleSearch()}
              disabled={loading}
              style={{ flexShrink: 0 }}
            >
              {loading ? (
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              ) : (
                <HiOutlineSearch />
              )}
              Xác minh
            </button>
          </div>
        </div>

        {/* QR Scanner */}
        {showScanner && (
          <div
            className="animate-scale-in"
            style={{
              maxWidth: 400,
              margin: '0 auto var(--space-8)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '2px solid var(--border)',
            }}
          >
            <div id="qr-reader" ref={scannerRef} style={{ width: '100%' }} />
            <div style={{
              padding: 'var(--space-3)',
              textAlign: 'center',
              background: 'var(--bg)',
              borderTop: '1px solid var(--border)',
            }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                📷 Đưa mã QR vào khung hình
              </p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="card-static" style={{ padding: 'var(--space-8)' }}>
              <div className="skeleton skeleton-title" style={{ width: '40%', margin: '0 auto var(--space-6)' }} />
              <div className="skeleton skeleton-text" style={{ width: '70%', margin: '0 auto var(--space-2)' }} />
              <div className="skeleton skeleton-text" style={{ width: '60%', margin: '0 auto var(--space-2)' }} />
              <div className="skeleton skeleton-text" style={{ width: '50%', margin: '0 auto' }} />
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && results !== null && (
          <div className="animate-fade-in-up">
            {results.length > 0 ? (
              <>
                {/* Success banner */}
                <div style={{
                  background: 'var(--success-light)',
                  border: '2px solid var(--success)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  textAlign: 'center',
                  marginBottom: 'var(--space-8)',
                  maxWidth: 700,
                  margin: '0 auto var(--space-8)',
                }}>
                  <HiOutlineCheckCircle style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: 'var(--space-3)' }} />
                  <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--success-dark)', marginBottom: 'var(--space-2)' }}>
                    BẰNG CHÍNH QUY — ĐÃ ĐƯỢC XÁC THỰC
                  </h2>
                  <p style={{ color: 'var(--success)', fontWeight: 500 }}>
                    Tìm thấy {results.length} văn bằng được xác thực bởi nhà trường trên Blockchain
                  </p>
                </div>

                {/* Degree cards */}
                <div className="grid grid-2" style={{ maxWidth: 900, margin: '0 auto' }}>
                  {results.map(({ tokenId, metadata }) => (
                    <div key={tokenId}>
                      <DegreeCard
                        tokenId={tokenId}
                        degree={{
                          name: metadata.name,
                          major: metadata.attributes?.major,
                          year: metadata.attributes?.year,
                          classification: metadata.attributes?.classification,
                          studentId: metadata.attributes?.studentId,
                          image: metadata.image,
                        }}
                      />

                      {/* Verification details */}
                      <div
                        style={{
                          marginTop: 'var(--space-3)',
                          padding: 'var(--space-4)',
                          background: 'var(--bg)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Contract</span>
                          <span className="mono" style={{ color: 'var(--text-tertiary)' }}>
                            {(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '').slice(0, 10)}...
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Token ID</span>
                          <span className="mono">#{tokenId}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Xếp loại</span>
                          <span style={{ fontWeight: 600 }}>
                            {classifications[metadata.attributes?.classification] || 'N/A'}
                          </span>
                        </div>
                        {metadata.attributes?.issueDate && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Ngày cấp</span>
                            <span>{new Date(metadata.attributes.issueDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                        <div style={{ marginTop: 8 }}>
                          <a
                            href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''}?a=${tokenId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              color: 'var(--primary)',
                              fontWeight: 500,
                            }}
                          >
                            Xem trên Etherscan <HiOutlineExternalLink />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Not found */
              <div style={{
                maxWidth: 500,
                margin: '0 auto',
                background: 'var(--error-light)',
                border: '2px solid var(--error)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                textAlign: 'center',
              }}>
                <HiOutlineXCircle style={{ fontSize: '3rem', color: 'var(--error)', marginBottom: 'var(--space-3)' }} />
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--error-dark)', marginBottom: 'var(--space-2)' }}>
                  KHÔNG TÌM THẤY BẰNG CẤP
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                  Địa chỉ ví này không có văn bằng số nào được cấp trên hệ thống Blockchain.
                  Vui lòng kiểm tra lại địa chỉ ví hoặc liên hệ nhà trường.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Initial state - show instructions */}
        {!loading && results === null && (
          <div className="text-center" style={{ maxWidth: 500, margin: '0 auto' }}>
            <div style={{ fontSize: '4rem', opacity: 0.2, marginBottom: 'var(--space-4)' }}>🔍</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
              Nhập địa chỉ ví Ethereum hoặc quét mã QR của sinh viên để kiểm tra
              tính hợp lệ của văn bằng số trên Blockchain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <span className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}
