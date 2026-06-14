'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineGlobeAlt,
  HiOutlineDatabase,
  HiOutlineAcademicCap,
  HiOutlineCloudUpload,
  HiOutlineSearch,
  HiOutlineArrowRight,
} from 'react-icons/hi';

/* ===== Intersection Observer Hook ===== */
function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const el = ref.current;
    if (el) {
      const elements = el.querySelectorAll('.reveal');
      elements.forEach((e) => observer.observe(e));
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ===== Animated Counter ===== */
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const startTime = Date.now();
          const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const pageRef = useReveal();

  return (
    <div ref={pageRef}>
      {/* ===== HERO SECTION ===== */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div className="container" style={styles.heroContent}>
          <div className="animate-fade-in-up" style={{ maxWidth: 700 }}>
            <div style={styles.heroBadge}>
              <HiOutlineShieldCheck style={{ fontSize: 16 }} />
              Công nghệ Blockchain
            </div>
            <h1 style={styles.heroTitle}>
              Hệ Thống Xác Minh{' '}
              <span style={styles.heroTitleAccent}>Văn Bằng Số</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Nền tảng xác minh văn bằng số dựa trên công nghệ Blockchain Ethereum,
              đảm bảo tính bất biến, minh bạch và an toàn tuyệt đối cho mọi bằng cấp.
            </p>
            <div style={styles.heroButtons}>
              <Link href="/verify" className="btn btn-primary btn-lg">
                <HiOutlineSearch />
                Xác minh bằng cấp
              </Link>
              <Link href="/admin" className="btn btn-secondary btn-lg">
                Quản trị viên
                <HiOutlineArrowRight />
              </Link>
            </div>
          </div>

          {/* CSS-only blockchain animation */}
          <div className="hide-mobile" style={styles.heroVisual}>
            <div style={styles.blockchainAnim}>
              <div style={{ ...styles.block, animationDelay: '0s' }}>
                <HiOutlineAcademicCap style={{ fontSize: 28 }} />
                <span style={styles.blockLabel}>Cấp bằng</span>
              </div>
              <div style={styles.chain} />
              <div style={{ ...styles.block, animationDelay: '0.3s' }}>
                <HiOutlineCloudUpload style={{ fontSize: 28 }} />
                <span style={styles.blockLabel}>Lưu IPFS</span>
              </div>
              <div style={styles.chain} />
              <div style={{ ...styles.block, animationDelay: '0.6s' }}>
                <HiOutlineShieldCheck style={{ fontSize: 28 }} />
                <span style={styles.blockLabel}>Xác minh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="reveal text-center" style={{ marginBottom: 'var(--space-12)' }}>
            <h2 style={styles.sectionTitle}>Quy trình hoạt động</h2>
            <p style={styles.sectionSubtitle}>
              Bốn bước để cấp và xác minh văn bằng số trên Blockchain
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
            {[
              {
                step: '01',
                icon: <HiOutlineAcademicCap />,
                title: 'Tạo yêu cầu',
                desc: 'Nhà trường tạo yêu cầu cấp bằng cho sinh viên trên hệ thống quản trị, thông tin được lưu trên Blockchain.',
                color: 'var(--primary)',
                bg: 'var(--primary-light)',
              },
              {
                step: '02',
                icon: <HiOutlineShieldCheck />,
                title: 'SV xác nhận & trả phí',
                desc: 'Sinh viên kiểm tra thông tin bằng cấp, xác nhận đúng và thanh toán phí 0.3 ETH để bằng được cấp.',
                color: 'var(--accent-gold-dark)',
                bg: 'var(--accent-gold-light)',
              },
              {
                step: '03',
                icon: <HiOutlineCloudUpload />,
                title: 'Mint SBT + Lưu IPFS',
                desc: 'Bằng cấp được mint dưới dạng Soulbound Token, dữ liệu lưu phi tập trung trên IPFS, không thể giả mạo.',
                color: 'var(--success)',
                bg: 'var(--success-light)',
              },
              {
                step: '04',
                icon: <HiOutlineSearch />,
                title: 'Xác minh Blockchain',
                desc: 'Bất kỳ ai cũng có thể xác minh bằng cấp qua địa chỉ ví, Token ID hoặc quét mã QR — không cần tài khoản.',
                color: 'var(--primary)',
                bg: 'var(--primary-light)',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal reveal-delay-${i + 1} card`}
                style={{ textAlign: 'center', padding: 'var(--space-8)' }}
              >
                <div style={{ ...styles.stepNumber, color: item.color }}>{item.step}</div>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 'var(--radius-xl)',
                    background: item.bg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    margin: '0 auto var(--space-4)',
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section">
        <div className="container">
          <div className="reveal text-center" style={{ marginBottom: 'var(--space-12)' }}>
            <h2 style={styles.sectionTitle}>Tại sao chọn chúng tôi?</h2>
            <p style={styles.sectionSubtitle}>
              Những ưu điểm vượt trội của hệ thống xác minh văn bằng trên Blockchain
            </p>
          </div>

          <div className="grid grid-4">
            {[
              {
                icon: <HiOutlineLockClosed />,
                title: 'Bất biến',
                desc: 'Dữ liệu một khi được ghi lên Blockchain sẽ không thể bị thay đổi hay xóa bỏ.',
                color: 'var(--primary)',
                bg: 'var(--primary-light)',
              },
              {
                icon: <HiOutlineGlobeAlt />,
                title: 'Minh bạch',
                desc: 'Mọi giao dịch đều được công khai và có thể kiểm tra trên Etherscan.',
                color: 'var(--success)',
                bg: 'var(--success-light)',
              },
              {
                icon: <HiOutlineShieldCheck />,
                title: 'An toàn',
                desc: 'Sử dụng mã hóa tiên tiến và Smart Contract để bảo vệ dữ liệu.',
                color: 'var(--accent-gold-dark)',
                bg: 'var(--accent-gold-light)',
              },
              {
                icon: <HiOutlineDatabase />,
                title: 'Phi tập trung',
                desc: 'Không phụ thuộc vào bất kỳ máy chủ trung tâm nào, đảm bảo khả dụng 24/7.',
                color: 'var(--error)',
                bg: 'var(--error-light)',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`reveal reveal-delay-${i + 1} card`}
                style={{ padding: 'var(--space-6)' }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: item.bg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="grid grid-4 reveal" style={{ textAlign: 'center' }}>
            {[
              { value: 1000, suffix: '+', label: 'Văn bằng đã cấp' },
              { value: 500, suffix: '+', label: 'Sinh viên xác minh' },
              { value: 100, suffix: '%', label: 'Chính xác' },
              { value: 24, suffix: '/7', label: 'Hoạt động liên tục' },
            ].map((stat, i) => (
              <div key={i} className={`reveal-delay-${i + 1}`}>
                <div style={styles.statValue}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section" style={styles.ctaSection}>
        <div className="container text-center reveal">
          <h2 style={{ ...styles.sectionTitle, color: 'white', marginBottom: 'var(--space-4)' }}>
            Bắt đầu xác minh ngay hôm nay
          </h2>
          <p style={{ ...styles.sectionSubtitle, color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--space-8)' }}>
            Kết nối ví MetaMask và trải nghiệm hệ thống xác minh văn bằng số hiện đại nhất
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/verify" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
              <HiOutlineSearch />
              Xác minh bằng cấp
            </Link>
            <Link href="/student" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              <HiOutlineAcademicCap />
              Xem bằng của tôi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===== Inline styles ===== */
const styles = {
  hero: {
    position: 'relative',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(160deg, #f0f6ff 0%, #e8f0fe 30%, #f8fafc 70%, #fdf6e3 100%)',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(26,86,219,0.05) 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, rgba(212,168,67,0.05) 0%, transparent 50%)`,
  },
  heroContent: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-12)',
    paddingTop: 'var(--space-8)',
    paddingBottom: 'var(--space-8)',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 16px',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    marginBottom: 'var(--space-6)',
  },
  heroTitle: {
    fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
    fontWeight: 900,
    lineHeight: 1.1,
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-6)',
  },
  heroTitleAccent: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-gold) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: 'var(--text-lg)',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    marginBottom: 'var(--space-8)',
    maxWidth: 560,
  },
  heroButtons: {
    display: 'flex',
    gap: 'var(--space-4)',
    flexWrap: 'wrap',
  },
  heroVisual: {
    flexShrink: 0,
  },
  blockchainAnim: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
  block: {
    width: 110,
    height: 110,
    borderRadius: 'var(--radius-xl)',
    background: 'var(--surface)',
    border: '2px solid var(--primary-200)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: 'var(--primary)',
    boxShadow: 'var(--shadow-md)',
    animation: 'float 3s ease-in-out infinite',
  },
  blockLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  chain: {
    width: 40,
    height: 3,
    background: 'linear-gradient(90deg, var(--primary-200), var(--primary), var(--primary-200))',
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
    fontWeight: 800,
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-3)',
  },
  sectionSubtitle: {
    fontSize: 'var(--text-lg)',
    color: 'var(--text-secondary)',
    maxWidth: 600,
    margin: '0 auto',
    lineHeight: 1.7,
  },
  stepNumber: {
    fontSize: 'var(--text-4xl)',
    fontWeight: 900,
    opacity: 0.15,
    marginBottom: 'var(--space-2)',
  },
  statValue: {
    fontSize: 'var(--text-4xl)',
    fontWeight: 900,
    color: 'var(--primary)',
    marginBottom: 'var(--space-2)',
  },
  statLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  ctaSection: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    padding: 'var(--space-20) 0',
  },
};
