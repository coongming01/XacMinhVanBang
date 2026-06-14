'use client';
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { connectWallet, getContract, getSigner, checkIsAdmin, getProvider, getReadProvider, MINT_FEE_ETH, RequestStatus } from '../../lib/contract';
import { uploadFileToPinata, uploadJSONToPinata, fetchFromIPFS } from '../../lib/pinata';
import toast from 'react-hot-toast';
import {
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineUpload,
  HiOutlineExternalLink,
  HiOutlineShieldExclamation,
  HiOutlineLockClosed,
  HiOutlineRefresh,
  HiOutlineDocumentAdd,
  HiOutlineCollection,
  HiOutlineCog,
} from 'react-icons/hi';

export default function AdminPage() {
  const [address, setAddress] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('single');

  // Single mint form
  const [form, setForm] = useState({
    studentName: '',
    studentId: '',
    major: '',
    year: '',
    classification: 'gioi',
    walletAddress: '',
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [minting, setMinting] = useState(false);

  // Batch mint
  const [batchRows, setBatchRows] = useState([
    { studentName: '', studentId: '', major: '', year: '', classification: 'gioi', walletAddress: '' },
  ]);
  const [batchMinting, setBatchMinting] = useState(false);

  // Management
  const [mintedDegrees, setMintedDegrees] = useState([]);
  const [loadingDegrees, setLoadingDegrees] = useState(false);
  const [revoking, setRevoking] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [stats, setStats] = useState(null);

  // Connect wallet and check admin
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
          const admin = await checkIsAdmin(accounts[0]);
          setIsAdmin(admin);
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
      const admin = await checkIsAdmin(addr);
      setIsAdmin(admin);
      if (!admin) {
        toast.error('Bạn không có quyền quản trị');
      }
    } catch (err) {
      toast.error('Kết nối ví thất bại');
    }
  };

  // Single mint
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      if (f.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(f));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleMint = async () => {
    if (!form.studentName || !form.walletAddress || !file) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setMinting(true);
    const toastId = toast.loading('Đang tải file lên IPFS...');

    try {
      // 1. Upload file to IPFS
      const fileResult = await uploadFileToPinata(file);
      toast.loading('Đang tải metadata lên IPFS...', { id: toastId });

      // 2. Create metadata and upload
      const metadata = {
        name: form.studentName,
        description: `Văn bằng tốt nghiệp - ${form.major} - Khóa ${form.year}`,
        image: `ipfs://${fileResult.ipfsHash}`,
        attributes: {
          studentName: form.studentName,
          studentId: form.studentId,
          major: form.major,
          year: form.year,
          classification: form.classification,
          issueDate: new Date().toISOString(),
        },
      };

      const jsonResult = await uploadJSONToPinata(metadata);
      toast.loading('Đang gửi giao dịch Blockchain...', { id: toastId });

      // 3. Call contract createRequest
      const signer = await getSigner();
      const contract = getContract(signer);
      const tx = await contract.createRequest(form.walletAddress, `ipfs://${jsonResult.ipfsHash}`);
      toast.loading('Đang chờ xác nhận...', { id: toastId });

      const receipt = await tx.wait();
      toast.success(
        <div>
          <strong>Đã tạo yêu cầu! Chờ sinh viên xác nhận và thanh toán {MINT_FEE_ETH} ETH.</strong>
          <br />
          <a
            href={`https://sepolia.etherscan.io/tx/${receipt.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', fontSize: '12px' }}
          >
            Xem giao dịch ↗
          </a>
        </div>,
        { id: toastId, duration: 8000 }
      );

      // Reset form
      setForm({ studentName: '', studentId: '', major: '', year: '', classification: 'gioi', walletAddress: '' });
      setFile(null);
      setFilePreview(null);
    } catch (err) {
      console.error('Create request error:', err);
      toast.error(err.reason || err.message || 'Tạo yêu cầu thất bại', { id: toastId });
    } finally {
      setMinting(false);
    }
  };

  // Batch mint
  const addBatchRow = () => {
    setBatchRows([
      ...batchRows,
      { studentName: '', studentId: '', major: '', year: '', classification: 'gioi', walletAddress: '' },
    ]);
  };

  const removeBatchRow = (idx) => {
    if (batchRows.length === 1) return;
    setBatchRows(batchRows.filter((_, i) => i !== idx));
  };

  const updateBatchRow = (idx, field, value) => {
    const rows = [...batchRows];
    rows[idx][field] = value;
    setBatchRows(rows);
  };

  const handleBatchMint = async () => {
    const valid = batchRows.every((r) => r.studentName && r.walletAddress);
    if (!valid) {
      toast.error('Vui lòng điền đầy đủ tên và địa chỉ ví cho tất cả sinh viên');
      return;
    }

    setBatchMinting(true);
    const toastId = toast.loading('Đang tải metadata lên IPFS...');

    try {
      const addresses = [];
      const uris = [];

      for (const row of batchRows) {
        const metadata = {
          name: row.studentName,
          description: `Văn bằng tốt nghiệp - ${row.major} - Khóa ${row.year}`,
          attributes: {
            studentName: row.studentName,
            studentId: row.studentId,
            major: row.major,
            year: row.year,
            classification: row.classification,
            issueDate: new Date().toISOString(),
          },
        };

        const jsonResult = await uploadJSONToPinata(metadata);
        addresses.push(row.walletAddress);
        uris.push(`ipfs://${jsonResult.ipfsHash}`);
      }

      toast.loading('Đang gửi giao dịch Blockchain...', { id: toastId });

      const signer = await getSigner();
      const contract = getContract(signer);
      const tx = await contract.createBatchRequests(addresses, uris);
      toast.loading('Đang chờ xác nhận...', { id: toastId });

      const receipt = await tx.wait();
      toast.success(
        <div>
          <strong>Tạo {batchRows.length} yêu cầu thành công! Chờ sinh viên xác nhận.</strong>
          <br />
          <a
            href={`https://sepolia.etherscan.io/tx/${receipt.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', fontSize: '12px' }}
          >
            Xem giao dịch ↗
          </a>
        </div>,
        { id: toastId, duration: 8000 }
      );

      setBatchRows([{ studentName: '', studentId: '', major: '', year: '', classification: 'gioi', walletAddress: '' }]);
    } catch (err) {
      console.error('Batch request error:', err);
      toast.error(err.reason || err.message || 'Tạo yêu cầu hàng loạt thất bại', { id: toastId });
    } finally {
      setBatchMinting(false);
    }
  };

  // Load stats from contract
  const loadStats = useCallback(async () => {
    try {
      const provider = getReadProvider();
      const contract = getContract(provider);
      const result = await contract.getStats();
      setStats({
        totalSupply: Number(result._totalSupply),
        totalRevenue: result._totalRevenue,
        requestCount: Number(result._requestCount),
        pendingCount: Number(result._pendingCount),
      });
    } catch (err) {
      console.error('Load stats error:', err);
    }
  }, []);

  // Load all requests from contract
  const loadMintedDegrees = useCallback(async () => {
    setLoadingDegrees(true);
    try {
      const provider = getReadProvider();
      const contract = getContract(provider);
      const count = Number(await contract.requestCount());

      const degrees = [];
      for (let i = 0; i < count; i++) {
        try {
          const req = await contract.requests(i);
          let name = 'N/A';
          try {
            const metadata = await fetchFromIPFS(req.metadataURI);
            name = metadata.name || metadata.studentName || (metadata.attributes && metadata.attributes.studentName) || 'N/A';
          } catch (e) {
            console.warn(`Failed to fetch IPFS for request ${i}:`, e);
          }

          degrees.push({
            requestId: i,
            wallet: req.student,
            name,
            metadataURI: req.metadataURI,
            createdAt: Number(req.createdAt),
            expiresAt: Number(req.expiresAt),
            status: Number(req.status),
            tokenId: Number(req.tokenId),
            rejectionReason: req.rejectionReason || '',
            date: req.createdAt > 0 ? new Date(Number(req.createdAt) * 1000).toLocaleDateString('vi-VN') : '-',
          });
        } catch {
          /* skip */
        }
      }

      setMintedDegrees(degrees.reverse());
    } catch (err) {
      console.error('Load requests error:', err);
      toast.error('Không thể tải danh sách yêu cầu');
    } finally {
      setLoadingDegrees(false);
    }
  }, []);

  const handleRevoke = async (tokenId) => {
    if (!window.confirm(`Bạn có chắc muốn thu hồi bằng Token #${tokenId}?`)) return;

    setRevoking(tokenId);
    const toastId = toast.loading('Đang thu hồi...');

    try {
      const signer = await getSigner();
      const contract = getContract(signer);
      const tx = await contract.revoke(tokenId);
      await tx.wait();
      toast.success('Thu hồi thành công!', { id: toastId });
      loadMintedDegrees();
      loadStats();
    } catch (err) {
      console.error('Revoke error:', err);
      toast.error(err.reason || 'Thu hồi thất bại', { id: toastId });
    } finally {
      setRevoking(null);
    }
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm(`Bạn có chắc muốn hủy yêu cầu #${requestId}?`)) return;

    setCancelling(requestId);
    const toastId = toast.loading('Đang hủy yêu cầu...');

    try {
      const signer = await getSigner();
      const contract = getContract(signer);
      const tx = await contract.cancelRequest(requestId);
      await tx.wait();
      toast.success('Đã hủy yêu cầu!', { id: toastId });
      loadMintedDegrees();
      loadStats();
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error(err.reason || 'Hủy yêu cầu thất bại', { id: toastId });
    } finally {
      setCancelling(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusName = RequestStatus[status];
    const styles = {
      PENDING: { background: 'var(--warning-light, #fef3cd)', color: 'var(--warning, #856404)', label: 'Đang chờ' },
      CONFIRMED: { background: 'var(--success-light, #d4edda)', color: 'var(--success, #155724)', label: 'Đã xác nhận' },
      EXPIRED: { background: 'var(--bg-tertiary, #e2e8f0)', color: 'var(--text-tertiary, #718096)', label: 'Hết hạn' },
      REJECTED: { background: 'var(--danger-light, #f8d7da)', color: 'var(--danger, #721c24)', label: 'Từ chối' },
      CANCELLED: { background: 'var(--bg-tertiary, #e2e8f0)', color: 'var(--text-tertiary, #718096)', label: 'Đã hủy' },
    };
    const s = styles[statusName] || styles.PENDING;
    return (
      <span style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 'var(--radius-full, 9999px)',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        background: s.background,
        color: s.color,
      }}>
        {s.label}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container loading-overlay">
          <div className="spinner spinner-lg" />
          <p>Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Not connected
  if (!address) {
    return (
      <div className="page-wrapper">
        <div className="access-denied">
          <div className="access-denied-icon">
            <HiOutlineLockClosed />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>Kết nối ví để tiếp tục</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
            Bạn cần kết nối ví MetaMask có quyền quản trị để truy cập trang này.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleConnect}>
            Kết nối MetaMask
          </button>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="page-wrapper">
        <div className="access-denied">
          <div className="access-denied-icon" style={{ background: 'var(--warning-light)' }}>
            <HiOutlineShieldExclamation />
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)' }}>Truy cập bị từ chối</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
            Địa chỉ ví <span className="mono">{address}</span> không có quyền quản trị (MINTER_ROLE).
          </p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
            Liên hệ quản trị viên hệ thống để được cấp quyền.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            🎓 Quản trị văn bằng
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Cấp, quản lý và thu hồi văn bằng số trên Blockchain
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'single' ? 'active' : ''}`}
            onClick={() => setActiveTab('single')}
          >
            <HiOutlineDocumentAdd style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Tạo yêu cầu
          </button>
          <button
            className={`tab ${activeTab === 'batch' ? 'active' : ''}`}
            onClick={() => setActiveTab('batch')}
          >
            <HiOutlineCollection style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Cấp hàng loạt
          </button>
          <button
            className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('manage');
              loadMintedDegrees();
              loadStats();
            }}
          >
            <HiOutlineCog style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Quản lý
          </button>
        </div>

        {/* Tab: Single Mint */}
        {activeTab === 'single' && (
          <div className="card-static animate-fade-in">
            <div className="card-body">
              <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
                <div className="form-group">
                  <label className="form-label">Họ tên sinh viên *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">MSSV</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="20210001"
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ngành học</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Công nghệ thông tin"
                    value={form.major}
                    onChange={(e) => setForm({ ...form, major: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Năm tốt nghiệp</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="2025"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Xếp loại</label>
                  <select
                    className="form-select"
                    value={form.classification}
                    onChange={(e) => setForm({ ...form, classification: e.target.value })}
                  >
                    <option value="xuat_sac">Xuất sắc</option>
                    <option value="gioi">Giỏi</option>
                    <option value="kha">Khá</option>
                    <option value="trung_binh_kha">Trung bình khá</option>
                    <option value="trung_binh">Trung bình</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Địa chỉ ví sinh viên *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="0x..."
                    value={form.walletAddress}
                    onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
                  />
                </div>
              </div>

              {/* File upload */}
              <div style={{ marginTop: 'var(--space-6)', clear: 'both', overflow: 'visible' }}>
                <label className="form-label" style={{ marginBottom: 'var(--space-3)', display: 'block' }}>
                  File bằng cấp (ảnh/PDF) *
                </label>
                <label className={`file-upload ${file ? 'has-file' : ''}`} style={{ display: 'block', width: '100%' }}>
                  <input type="file" accept="image/*,.pdf" onChange={handleFileChange} />
                  {file ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      {filePreview && (
                        <img
                          src={filePreview}
                          alt="Preview"
                          style={{ maxHeight: 160, borderRadius: 'var(--radius-md)' }}
                        />
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                        ✓ {file.name}
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                        ({(file.size / 1024).toFixed(1)} KB) — Nhấn để đổi file
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <HiOutlineUpload style={{ fontSize: '2rem', color: 'var(--text-tertiary)' }} />
                      <span style={{ fontWeight: 500 }}>Nhấn hoặc kéo thả file vào đây</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                        Hỗ trợ: JPG, PNG, PDF (tối đa 10MB)
                      </span>
                    </div>
                  )}
                </label>
              </div>

              <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary btn-lg" onClick={handleMint} disabled={minting}>
                  {minting ? (
                    <>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <HiOutlinePlusCircle />
                      Tạo yêu cầu cấp bằng
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Batch Mint */}
        {activeTab === 'batch' && (
          <div className="card-static animate-fade-in">
            <div className="card-body">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Họ tên *</th>
                      <th>MSSV</th>
                      <th>Ngành</th>
                      <th>Năm</th>
                      <th>Xếp loại</th>
                      <th>Địa chỉ ví *</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchRows.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: 'var(--text-tertiary)' }}>{idx + 1}</td>
                        <td>
                          <input
                            className="form-input"
                            type="text"
                            placeholder="Tên SV"
                            value={row.studentName}
                            onChange={(e) => updateBatchRow(idx, 'studentName', e.target.value)}
                            style={{ minWidth: 140 }}
                          />
                        </td>
                        <td>
                          <input
                            className="form-input"
                            type="text"
                            placeholder="MSSV"
                            value={row.studentId}
                            onChange={(e) => updateBatchRow(idx, 'studentId', e.target.value)}
                            style={{ minWidth: 100 }}
                          />
                        </td>
                        <td>
                          <input
                            className="form-input"
                            type="text"
                            placeholder="Ngành"
                            value={row.major}
                            onChange={(e) => updateBatchRow(idx, 'major', e.target.value)}
                            style={{ minWidth: 130 }}
                          />
                        </td>
                        <td>
                          <input
                            className="form-input"
                            type="text"
                            placeholder="Năm"
                            value={row.year}
                            onChange={(e) => updateBatchRow(idx, 'year', e.target.value)}
                            style={{ minWidth: 70 }}
                          />
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={row.classification}
                            onChange={(e) => updateBatchRow(idx, 'classification', e.target.value)}
                            style={{ minWidth: 100 }}
                          >
                            <option value="xuat_sac">Xuất sắc</option>
                            <option value="gioi">Giỏi</option>
                            <option value="kha">Khá</option>
                            <option value="trung_binh_kha">TB khá</option>
                            <option value="trung_binh">TB</option>
                          </select>
                        </td>
                        <td>
                          <input
                            className="form-input"
                            type="text"
                            placeholder="0x..."
                            value={row.walletAddress}
                            onChange={(e) => updateBatchRow(idx, 'walletAddress', e.target.value)}
                            style={{ minWidth: 180 }}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => removeBatchRow(idx)}
                            title="Xóa dòng"
                            disabled={batchRows.length === 1}
                          >
                            <HiOutlineTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <button className="btn btn-secondary" onClick={addBatchRow}>
                  <HiOutlinePlusCircle />
                  Thêm sinh viên
                </button>

                <button className="btn btn-primary btn-lg" onClick={handleBatchMint} disabled={batchMinting}>
                  {batchMinting ? (
                    <>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <HiOutlineCollection />
                      Cấp tất cả ({batchRows.length})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Management */}
        {activeTab === 'manage' && (
          <div className="animate-fade-in">
            {/* Stats Dashboard */}
            {stats && (
              <div className="grid grid-2" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div className="card-static" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary)' }}>
                    {stats.totalSupply}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                    Tổng bằng đã cấp
                  </div>
                </div>
                <div className="card-static" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--warning, #d69e2e)' }}>
                    {stats.pendingCount}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                    Đang chờ xác nhận
                  </div>
                </div>
                <div className="card-static" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--success, #38a169)' }}>
                    {ethers.formatEther(stats.totalRevenue)} ETH
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                    Tổng phí thu được
                  </div>
                </div>
                <div className="card-static" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {stats.requestCount}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
                    Tổng yêu cầu
                  </div>
                </div>
              </div>
            )}

            <div className="card-static">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Danh sách yêu cầu cấp bằng</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => { loadMintedDegrees(); loadStats(); }} disabled={loadingDegrees}>
                  <HiOutlineRefresh className={loadingDegrees ? 'spinning' : ''} />
                  Làm mới
                </button>
              </div>

              {loadingDegrees ? (
                <div className="loading-overlay" style={{ padding: 'var(--space-12)' }}>
                  <div className="spinner spinner-lg" />
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : mintedDegrees.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <p className="empty-state-title">Chưa có dữ liệu</p>
                  <p className="empty-state-desc">
                    Chưa có yêu cầu nào hoặc không thể tải dữ liệu từ blockchain.
                  </p>
                </div>
              ) : (
                <div className="table-wrapper" style={{ borderRadius: 0, border: 'none', borderTop: 'none' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Ví sinh viên</th>
                        <th>Trạng thái</th>
                        <th>Token</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mintedDegrees.map((deg) => (
                        <tr key={deg.requestId}>
                          <td>
                            <span className="badge badge-gold">#{deg.requestId}</span>
                          </td>
                          <td style={{ fontWeight: 500 }}>{deg.name}</td>
                          <td>
                            <span className="mono" style={{ fontSize: 'var(--text-xs)' }}>
                              {deg.wallet.slice(0, 8)}...{deg.wallet.slice(-6)}
                            </span>
                          </td>
                          <td>
                            {getStatusBadge(deg.status)}
                            {deg.rejectionReason && (
                              <div style={{
                                fontSize: 'var(--text-xs)',
                                color: 'var(--danger, #dc3545)',
                                marginTop: 4,
                                fontStyle: 'italic',
                                maxWidth: 200,
                                lineHeight: 1.4,
                              }}>
                                💬 {deg.rejectionReason}
                              </div>
                            )}
                          </td>
                          <td>
                            {deg.tokenId > 0 ? (
                              <span className="badge badge-gold">#{deg.tokenId}</span>
                            ) : (
                              <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>—</span>
                            )}
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{deg.date}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {RequestStatus[deg.status] === 'PENDING' && (
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleCancel(deg.requestId)}
                                  disabled={cancelling === deg.requestId}
                                >
                                  {cancelling === deg.requestId ? (
                                    <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                                  ) : (
                                    'Hủy'
                                  )}
                                </button>
                              )}
                              {RequestStatus[deg.status] === 'CONFIRMED' && deg.tokenId > 0 && (
                                <>
                                  <a
                                    href={`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''}?a=${deg.tokenId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-ghost btn-sm"
                                    title="Xem trên Etherscan"
                                  >
                                    <HiOutlineExternalLink />
                                  </a>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRevoke(deg.tokenId)}
                                    disabled={revoking === deg.tokenId}
                                  >
                                    {revoking === deg.tokenId ? (
                                      <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                                    ) : (
                                      'Thu hồi'
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
