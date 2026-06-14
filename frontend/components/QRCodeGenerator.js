'use client';
import { useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function QRCodeGenerator({ value, size = 200, label = '' }) {
  const qrRef = useRef(null);

  const handleDownload = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) {
      toast.error('Không thể tạo QR code');
      return;
    }

    // Create a larger canvas with padding and label
    const padding = 32;
    const labelHeight = label ? 40 : 0;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width + padding * 2;
    exportCanvas.height = canvas.height + padding * 2 + labelHeight;

    const ctx = exportCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.drawImage(canvas, padding, padding);

    if (label) {
      ctx.fillStyle = '#1e293b';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, exportCanvas.width / 2, canvas.height + padding + 28);
    }

    const link = document.createElement('a');
    link.download = `qr-${value.slice(0, 10)}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
    toast.success('Đã tải QR code');
  }, [value, label]);

  if (!value) return null;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '2px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
      }}
    >
      <div ref={qrRef}>
        <QRCodeCanvas
          value={value}
          size={size}
          bgColor="#ffffff"
          fgColor="#1e293b"
          level="H"
          includeMargin={false}
          imageSettings={{
            src: '',
            height: 0,
            width: 0,
            excavate: false,
          }}
        />
      </div>

      {label && (
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            wordBreak: 'break-all',
            textAlign: 'center',
            maxWidth: size,
          }}
        >
          {label}
        </p>
      )}

      <button className="btn btn-secondary btn-sm" onClick={handleDownload}>
        <HiOutlineDownload />
        Tải QR Code
      </button>
    </div>
  );
}
