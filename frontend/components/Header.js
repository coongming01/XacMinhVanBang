'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import ConnectWallet from './ConnectWallet';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/admin', label: 'Quản trị' },
  { href: '/student', label: 'Sinh viên' },
  { href: '/verify', label: 'Xác minh' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          <span className="header-logo-icon">🎓</span>
          <span className="hide-mobile">XacMinhVanBang</span>
        </Link>

        <nav className={`header-nav ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`header-nav-link ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <ConnectWallet />
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
