'use client';
import { HiOutlineExternalLink, HiOutlineAcademicCap } from 'react-icons/hi';
import { getIPFSUrl } from '../lib/pinata';

const classifications = {
  'xuat_sac': 'Xuất sắc',
  'gioi': 'Giỏi',
  'kha': 'Khá',
  'trung_binh_kha': 'Trung bình khá',
  'trung_binh': 'Trung bình',
};

export default function DegreeCard({ degree, tokenId, onClick }) {
  const imageUrl = degree?.image
    ? getIPFSUrl(degree.image)
    : null;

  const classLabel = classifications[degree?.classification] || degree?.classification || '';

  const etherscanUrl = tokenId != null
    ? `https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''}?a=${tokenId}`
    : null;

  return (
    <div
      className="card"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: 180,
          background: imageUrl
            ? `url(${imageUrl}) center/cover no-repeat`
            : 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-200) 100%)',
          position: 'relative',
        }}
      >
        {!imageUrl && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              fontSize: '3rem',
              opacity: 0.4,
            }}
          >
            <HiOutlineAcademicCap />
          </div>
        )}
        {tokenId != null && (
          <span
            className="badge badge-gold"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontSize: '11px',
              padding: '4px 10px',
              backdropFilter: 'blur(4px)',
            }}
          >
            Token #{String(tokenId)}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
        >
          {degree?.name || 'Không có tên'}
        </h3>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          {degree?.major || 'N/A'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {degree?.year && (
            <span className="badge badge-primary">Khóa {degree.year}</span>
          )}
          {classLabel && (
            <span className="badge badge-success">{classLabel}</span>
          )}
        </div>

        {degree?.studentId && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            MSSV: {degree.studentId}
          </p>
        )}
      </div>

      {/* Card footer */}
      {etherscanUrl && (
        <div className="card-footer">
          <a
            href={etherscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--text-xs)',
              color: 'var(--primary)',
              fontWeight: 500,
            }}
          >
            Xem trên Etherscan <HiOutlineExternalLink />
          </a>
        </div>
      )}
    </div>
  );
}
