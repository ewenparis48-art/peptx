'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { useCart } from './CartProvider';
import LogoDisintegration from './LogoDisintegration';

export default function Header() {
  const { theme, toggle } = useTheme();
  const { items } = useCart();
  const isDark = theme === 'dark';
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = items.reduce((s, i) => s + i.count, 0);

  return (
    <header style={{
      background: 'var(--bg)',
      borderBottom: '1px solid var(--rule)',
      padding: '12px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: 'Inter, sans-serif',
      fontSize: 13, color: 'var(--fg)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <LogoDisintegration isDark={isDark} />
        <div
          className="desktop-only"
          style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.1em' }}
        >
          v4.2 · LOT.PX-2604 · LIVE
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="desktop-only" style={{ display: 'flex', gap: 22, alignItems: 'center', color: 'var(--mute)' }}>
        <Link href="/" style={{ color: 'var(--fg)', textDecoration: 'none', fontSize: 13 }}>Catalogue</Link>
        <span style={{ color: 'var(--mute)', fontSize: 13, cursor: 'default' }}>Analyses</span>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            color: 'var(--mute)',
            fontFamily: 'Space Mono, monospace',
            fontSize: 11,
            border: '1px solid var(--rule)',
            padding: '4px 8px',
            borderRadius: 2,
            cursor: 'pointer',
            background: 'transparent',
            letterSpacing: '0.08em',
            transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          {isDark ? '☼ LIGHT' : '☾ DARK'}
        </button>

        {/* Cart */}
        <Link href="/checkout" style={{ textDecoration: 'none' }}>
          <span className="cart-btn">
            CART · {totalItems}
          </span>
        </Link>
      </nav>

      {/* Mobile nav */}
      <div className="mobile-only" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link href="/checkout" style={{ textDecoration: 'none' }}>
          <span className="cart-btn" style={{ fontSize: 10 }}>
            ▤ {totalItems}
          </span>
        </Link>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--fg)', fontSize: 20, cursor: 'pointer',
          }}
        >
          {menuOpen ? '✕' : '≡'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--panel)',
          borderBottom: '1px solid var(--rule)',
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 16,
          zIndex: 100,
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)}
            style={{ color: 'var(--fg)', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
            Catalogue
          </Link>
          <button
            onClick={() => { toggle(); setMenuOpen(false); }}
            style={{
              background: 'transparent', border: '1px solid var(--rule)',
              color: 'var(--mute)', padding: '10px 14px', fontSize: 13,
              fontFamily: 'Space Mono, monospace', cursor: 'pointer', textAlign: 'left',
              letterSpacing: '0.08em',
            }}
          >
            {isDark ? '☼ Mode clair' : '☾ Mode sombre'}
          </button>
        </div>
      )}
    </header>
  );
}
