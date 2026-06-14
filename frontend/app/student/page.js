'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { connectWallet, getContract, getProvider, getReadProvider, getSigner, MINT_FEE_ETH, RequestStatus } from '../../lib/contract';
import { fetchFromIPFS, getIPFSUrl } from '../../lib/pinata';
import DegreeCard from '../../components/DegreeCard';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import toast from 'react-hot-toast';
import {
  HiOutlineAcademicCap,
  HiOutlineLockClosed,
  HiOutlineX,
  HiOutlineExternalLink,
  HiOutlineQrcode,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi';

const classifications = {
  xuat_sac: 'Xuất sắc',
  gioi: 'Giỏi',
  kha: 'Khá',
  trung_binh_kha: 'Trung bình khá',
  trung_binh: 'Trung bình',
};

export default function StudentPage() {
  const [address, setAddress] = useState(null);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // requestId to reject
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    async function init() {
      try {
        if (typeof window === 'undefined' || !window.ethereum) {
          setLoading(false);
          return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          await loadDegrees(accounts[0]);
          await loadPendingRequests(accounts[0]);
        }
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleConnect = async () => {
    try {
      const { address: addr } = await connectWallet();
      setAddress(addr);
      setLoading(true);
      await loadDegrees(addr);
      await loadPendingRequests(addr);
    } catch (err) {
      toast.error('Kết nối ví thất bại');
    } finally {
      setLoading(false);
    }
  };

  const loadDegrees = async (walletAddr) => {
    try {
      const provider = getReadProvider();
      const contract = getContract(provider);

      let tokenIds = [];
      try {
        // Try tokensOfOwner first
        const ids = await contract.tokensOfOwner(walletAddr);
        tokenIds = ids.map((id) => id.toString());
      } catch {
        // Fallback to balanceOf + tokenOfOwnerByIndex
        try {
          const balance = await contract.balanceOf(walletAddr);
          const balNum = Number(balance);
          for (let i = 0; i < balNum; i++) {
            const tokenId = await contract.tokenOfOwnerByIndex(walletAddr, i);
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
          degreesData.push({
            tokenId,
            metadata: { name: 'Không thể tải', description: 'Dữ liệu không khả dụng' },
          });
        }
      }

      setDegrees(degreesData);
    } catch (err) {
      console.error('Load degrees error:', err);
    }
  };

  const loadPendingRequests = async (walletAddr) => {
    setLoadingPending(true);
    try {
      const provider = getReadProvider();
      const contract = getContract(provider);
      const requestIds = await contract.getPendingRequests(walletAddr);

      const requests = [];
      for (const reqId of requestIds) {
        try {
          const req = await contract.requests(reqId);
          const status = Number(req.status);
          if (status !== RequestStatus.PENDING) continue;

          let metadata = {};
          try {
            metadata = await fetchFromIPFS(req.metadataURI);
          } catch (e) {
            console.error(`Error fetching metadata for request ${reqId}:`, e);
          }

          requests.push({
            requestId: reqId.toString(),
            student: req.student,
            metadataURI: req.metadataURI,
            expiresAt: Number(req.expiresAt),
            name: metadata.name || 'N/A',
            studentId: metadata.attributes?.studentId || 'N/A',
            major: metadata.attributes?.major || 'N/A',
            year: metadata.attributes?.year || 'N/A',
            classification: metadata.attributes?.classification || 'N/A',
          });
        } catch (e) {
          console.error(`Error loading request ${reqId}:`, e);
        }
      }

      setPendingRequests(requests);
    } catch (err) {
      console.error('Load pending requests error:', err);
    } finally {
      setLoadingPending(false);
    }
  };

  const handleConfirmAndPay = async (requestId) => {
    setConfirming(requestId);
    try {
      const signer = await getSigner();
      const contract = getContract(signer);
      const tx = await contract.confirmAndMint(requestId, {
        value: ethers.parseEther(MINT_FEE_ETH),
      });
      toast.loading('Đang xử lý giao dịch...', { id: 'confirm-tx' });
      await tx.wait();
      toast.success('Bằng đã được cấp thành công! Phí 0.3 ETH đã được thanh toán.', { id: 'confirm-tx' });
      await loadPendingRequests(address);
      await loadDegrees(address);
    } catch (err) {
      console.error('Confirm error:', err);
      toast.error(err.reason || 'Xác nhận thất bại. Vui lòng thử lại.');
    } finally {
      setConfirming(null);
    }
  };

  const handleReject = async (requestId, reason) => {
    if (!reason || reason.trim().length === 0) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    setRejecting(requestId);
    try {
      const signer = await getSigner();
      const contract = getContract(signer);
      const tx = await contract.rejectRequest(requestId, reason.trim());
      toast.loading('Đang xử lý...', { id: 'reject-tx' });
      await tx.wait();
      toast.success('Đã từ chối yêu cầu. Lý do đã được ghi trên blockchain.', { id: 'reject-tx' });
      setRejectModal(null);
      setRejectReason('');
      await loadPendingRequests(address);
    } catch (err) {
      console.error('Reject error:', err);
      toast.error(err.reason || 'Từ chối thất bại. Vui lòng thử lại.');
    } finally {
      setRejecting(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container loading-overlay">
          <div className="spinner spinner-lg" />
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Not connected
  if (!address) {
    return (
      <div className="page-wrapper">
        <div className="access-denied">
          <div className="access-denied-icon" style={{ background: 'var(--primary-light)' }}>
            <HiOutlineLockClosed style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>Kết nối ví để xem bằng cấp</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
            Kết nối ví MetaMask để xem các văn bằng số được cấp cho bạn.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleConnect}>
            Kết nối MetaMask
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
              🎓 Văn bằng của tôi
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Các văn bằng số được cấp cho ví{' '}
              <span className="mono">{address.slice(0, 8)}...{address.slice(-6)}</span>
            </p>
          </div>

          <button className="btn btn-secondary" onClick={() => setShowQR(!showQR)}>
            <HiOutlineQrcode />
            {showQR ? 'Ẩn QR Code' : 'Chia sẻ QR Code'}
          </button>
        </div>

        {/* QR Code section */}
        {showQR && (
          <div
            className="animate-slide-up"
            style={{
              marginBottom: 'var(--space-8)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <QRCodeGenerator
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify?wallet=${address}`}
              label={`Quét để xác minh văn bằng`}
              size={220}
            />
          </div>
        )}

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <div style={{ marginBottom: 'var(--space-8)' }} className="animate-slide-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>📋 Yêu cầu đang chờ xác nhận</h2>
              <span style={{
                background: 'var(--warning)',
                color: '#fff',
                borderRadius: 'var(--radius-full)',
                padding: '2px 10px',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
              }}>
                {pendingRequests.length}
              </span>
            </div>
            <div className="grid grid-3">
              {pendingRequests.map((req) => (
                <div key={req.requestId} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'var(--warning)',
                  }} />
                  <div style={{ padding: 'var(--space-5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                      <span style={{
                        background: 'rgba(234, 179, 8, 0.1)',
                        color: '#b45309',
                        borderRadius: 'var(--radius-full)',
                        padding: '4px 12px',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        ⏳ Đang chờ xác nhận
                      </span>
                      <Countdown expiresAt={req.expiresAt} />
                    </div>

                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
                      {req.name}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                      <DetailRow label="MSSV" value={req.studentId} />
                      <DetailRow label="Ngành học" value={req.major} />
                      <DetailRow label="Năm tốt nghiệp" value={req.year} />
                      <DetailRow label="Xếp loại" value={classifications[req.classification] || req.classification} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      <button
                        className="btn btn-success"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => handleConfirmAndPay(req.requestId)}
                        disabled={confirming === req.requestId}
                      >
                        {confirming === req.requestId ? (
                          <><div className="spinner spinner-sm" /> Đang xử lý...</>
                        ) : (
                          <>✅ Xác nhận & Thanh toán {MINT_FEE_ETH} ETH</>
                        )}
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => { setRejectModal(req.requestId); setRejectReason(''); }}
                        disabled={rejecting === req.requestId}
                      >
                        {rejecting === req.requestId ? (
                          <><div className="spinner spinner-sm" /> Đang xử lý...</>
                        ) : (
                          <>❌ Từ chối</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loadingPending && (
          <div style={{ textAlign: 'center', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div className="spinner spinner-sm" style={{ margin: '0 auto' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>Đang tải yêu cầu chờ...</p>
          </div>
        )}

        {!loadingPending && address && pendingRequests.length === 0 && degrees.length > 0 && null}

        {/* Degree cards */}
        {degrees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎓</div>
            <p className="empty-state-title">Chưa có văn bằng nào</p>
            <p className="empty-state-desc">
              Ví của bạn hiện chưa được cấp văn bằng số nào. Vui lòng liên hệ nhà trường nếu bạn đã tốt nghiệp.
            </p>
          </div>
        ) : (
          <div className="grid grid-3">
            {degrees.map(({ tokenId, metadata }) => (
              <DegreeCard
                key={tokenId}
                tokenId={tokenId}
                degree={{
                  name: metadata.name,
                  major: metadata.attributes?.major,
                  year: metadata.attributes?.year,
                  classification: metadata.attributes?.classification,
                  studentId: metadata.attributes?.studentId,
                  image: metadata.image,
                }}
                onClick={() => setSelectedDegree({ tokenId, metadata })}
              />
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedDegree && (
          <div className="modal-backdrop" onClick={() => setSelectedDegree(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Chi tiết văn bằng</h3>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => setSelectedDegree(null)}
                >
                  <HiOutlineX />
                </button>
              </div>
              <div className="modal-body">
                {selectedDegree.metadata.image && (
                  <div
                    style={{
                      marginBottom: 'var(--space-6)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={getIPFSUrl(selectedDegree.metadata.image)}
                      alt="Văn bằng"
                      style={{ width: '100%', maxHeight: 300, objectFit: 'contain', background: 'var(--bg-alt)' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <DetailRow label="Họ tên" value={selectedDegree.metadata.name} />
                  <DetailRow label="MSSV" value={selectedDegree.metadata.attributes?.studentId} />
                  <DetailRow label="Ngành học" value={selectedDegree.metadata.attributes?.major} />
                  <DetailRow label="Năm tốt nghiệp" value={selectedDegree.metadata.attributes?.year} />
                  <DetailRow
                    label="Xếp loại"
                    value={classifications[selectedDegree.metadata.attributes?.classification] || selectedDegree.metadata.attributes?.classification}
                  />
                  <DetailRow label="Token ID" value={`#${selectedDegree.tokenId}`} mono />
                  <DetailRow label="Ngày cấp" value={selectedDegree.metadata.attributes?.issueDate ? new Date(selectedDegree.metadata.attributes.issueDate).toLocaleDateString('vi-VN') : 'N/A'} />
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''}?a=${selectedDegree.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  <HiOutlineExternalLink />
                  Xem trên Etherscan
                </a>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDegree(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Reject Reason Modal */}
        {rejectModal !== null && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: 'var(--space-4)',
          }}>
            <div className="card animate-slide-up" style={{
              maxWidth: 480, width: '100%',
              padding: 'var(--space-6)',
            }}>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                ❌ Lý do từ chối yêu cầu #{rejectModal}
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                Lý do sẽ được ghi vĩnh viễn trên blockchain để nhà trường biết cần sửa thông tin gì.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Sai họ tên, sai ngành học, sai năm tốt nghiệp..."
                rows={3}
                style={{
                  width: '100%', padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--border)',
                  fontSize: 'var(--text-sm)',
                  resize: 'vertical',
                  marginBottom: 'var(--space-4)',
                  fontFamily: 'inherit',
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => handleReject(rejectModal, rejectReason)}
                  disabled={rejecting === rejectModal || !rejectReason.trim()}
                >
                  {rejecting === rejectModal ? (
                    <><div className="spinner spinner-sm" /> Đang gửi...</>
                  ) : (
                    <>❌ Xác nhận từ chối</>
                  )}
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ justifyContent: 'center' }}
                  onClick={() => { setRejectModal(null); setRejectReason(''); }}
                  disabled={rejecting === rejectModal}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono: isMono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{label}</span>
      <span
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          fontFamily: isMono ? 'var(--font-mono)' : 'inherit',
        }}
      >
        {value || 'N/A'}
      </span>
    </div>
  );
}

function Countdown({ expiresAt }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = expiresAt - now;
      if (diff <= 0) {
        setTimeLeft('Đã hết hạn');
        return;
      }
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      if (days > 0) {
        setTimeLeft(`Còn ${days} ngày ${hours} giờ`);
      } else if (hours > 0) {
        setTimeLeft(`Còn ${hours} giờ ${minutes} phút`);
      } else {
        setTimeLeft(`Còn ${minutes} phút`);
      }
    };
    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const now = Math.floor(Date.now() / 1000);
  const isExpired = expiresAt - now <= 0;

  return (
    <span style={{
      fontSize: 'var(--text-xs)',
      color: isExpired ? 'var(--error)' : 'var(--text-secondary)',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    }}>
      <HiOutlineClock style={{ fontSize: 14 }} />
      {timeLeft}
    </span>
  );
}
