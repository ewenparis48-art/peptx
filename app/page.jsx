'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products } from '../lib/products';
import { useCart } from '../components/CartProvider';

const kpis = [
  ['PURETÉ MOY.', '99.4%', 'var(--teal)'],
  ['LOT EN COURS', 'PX-2604', 'var(--fg)'],
  ['SHIP. 24H', 'FR · EU', 'var(--green)'],
  ['SUPPORT', '< 2h', 'var(--fg)'],
];

const TABS = ['Tous', 'Peptides', 'Accessoires', 'COA'];

export default function HomePage() {
  const router = useRouter();
  const { add, items } = useCart();
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [addedKey, setAddedKey] = useState(null);

  const filtered = products.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const totalItems = items.reduce((s, i) => s + i.count, 0);

  const handleAddToCart = (e, product, qty) => {
    e.stopPropagation();
    const price = qty === 1 ? product.price1 : qty === 5 ? product.price5 : product.price10;
    add(product, qty, price);
    const key = `${product.sku}-${qty}`;
    setAddedKey(key);
    setTimeout(() => setAddedKey(null), 1200);
  };

  const goToProduct = (sku) => router.push(`/product/${sku}`);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '80vh' }}>
      {/* Hero */}
      <div style={{
        padding: 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 28px) 24px',
        borderBottom: '1px solid var(--rule)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: 40,
        alignItems: 'end',
      }}
        className="hero-grid"
      >
        <div>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11, color: 'var(--mute)',
            letterSpacing: '0.18em', marginBottom: 14,
          }}>
            ◆ INVENTORY · 09.05.2026 · PEPTIDES & ACCESSORIES ({products.length})
          </div>
          <h1 style={{
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            lineHeight: 1, fontWeight: 500,
            letterSpacing: '-0.02em',
          }}>
            Données brutes.<br />
            <span style={{ color: 'var(--teal)' }}>Vials</span> précis.
          </h1>
          <p style={{
            marginTop: 22, fontSize: 13, color: 'var(--mute)',
            lineHeight: 1.6, maxWidth: 520,
          }}>
            Catalogue temps réel — pureté, lot, COA. Chaque ligne est
            cliquable vers sa fiche produit complète.
          </p>
        </div>

        {/* KPI grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1, background: 'var(--rule)',
          border: '1px solid var(--rule)',
        }}>
          {kpis.map(([k, v, c]) => (
            <div key={k} style={{ background: 'var(--panel)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--mute)', letterSpacing: '0.18em' }}>{k}</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, color: c, fontWeight: 600, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters + search */}
      <div style={{
        display: 'flex', gap: 0,
        padding: '0 clamp(16px, 3vw, 28px)',
        borderBottom: '1px solid var(--rule)',
        alignItems: 'center',
        overflowX: 'auto',
      }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} style={{
            padding: '14px 18px',
            fontSize: 13,
            color: i === activeTab ? 'var(--fg)' : 'var(--mute)',
            background: 'transparent', border: 'none',
            borderBottom: i === activeTab ? '2px solid var(--teal)' : '2px solid transparent',
            marginBottom: -1, cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
          }}>
            {t}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', padding: '8px 0' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="⌕ filter / search…"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'Space Mono, monospace',
              fontSize: 11,
              color: 'var(--mute)',
              padding: '6px 10px',
              width: 180,
            }}
          />
        </div>
      </div>

      {/* Table header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '90px 1.6fr 70px 80px 1fr 80px 80px 80px',
        padding: '10px 28px',
        fontFamily: 'Space Mono, monospace',
        fontSize: 10, color: 'var(--faint)',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        borderBottom: '1px solid var(--rule)',
      }} className="table-header desktop-only">
        <span>SKU</span>
        <span>Composé</span>
        <span>Dose</span>
        <span>Pureté</span>
        <span>Lot</span>
        <span style={{ textAlign: 'right' }}>×1</span>
        <span style={{ textAlign: 'right' }}>×5</span>
        <span style={{ textAlign: 'right' }}>×10</span>
      </div>

      {/* Table rows */}
      {filtered.map((p, i) => {
        const k1 = `${p.sku}-1`, k5 = `${p.sku}-5`, k10 = `${p.sku}-10`;
        return (
          <div
            key={p.sku}
            onClick={() => goToProduct(p.sku)}
            className="table-row desktop-only"
            style={{
              display: 'grid',
              gridTemplateColumns: '90px 1.6fr 70px 80px 1fr 80px 80px 80px',
              padding: '14px 28px',
              borderBottom: '1px solid var(--rule)',
              alignItems: 'center',
              background: i % 2 === 1 ? 'var(--panel)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--teal)', letterSpacing: '0.06em', fontSize: 11 }}>{p.sku}</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 500 }}>{p.name}</span>
            <span style={{ color: 'var(--mute)', fontFamily: 'Space Mono, monospace', fontSize: 11 }}>{p.dose}</span>
            <span style={{ color: 'var(--teal)', fontWeight: 600, fontFamily: 'Space Mono, monospace', fontSize: 11 }}>{p.purity}%</span>
            <span style={{ color: 'var(--mute)', fontFamily: 'Space Mono, monospace', fontSize: 11 }}>{p.lot}</span>

            {/* x1 — clickable */}
            <button
              onClick={e => handleAddToCart(e, p, 1)}
              title="Ajouter 1×"
              style={{
                textAlign: 'right',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
                background: addedKey === k1 ? 'var(--teal)' : 'transparent',
                color: addedKey === k1 ? 'var(--bg)' : 'var(--fg)',
                border: 'none', cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: 2,
                transition: 'background 0.2s, color 0.2s',
                width: '100%',
              }}
            >
              {p.price1}€
            </button>

            {/* x5 */}
            <button
              onClick={e => handleAddToCart(e, p, 5)}
              title="Ajouter 5×"
              style={{
                textAlign: 'right',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
                background: addedKey === k5 ? 'var(--teal)' : 'transparent',
                color: addedKey === k5 ? 'var(--bg)' : 'var(--fg)',
                border: 'none', cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: 2,
                transition: 'background 0.2s, color 0.2s',
                width: '100%',
              }}
            >
              {p.price5}€
            </button>

            {/* x10 */}
            <button
              onClick={e => handleAddToCart(e, p, 10)}
              title="Ajouter 10×"
              style={{
                textAlign: 'right',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
                background: addedKey === k10 ? 'var(--teal)' : 'transparent',
                color: addedKey === k10 ? 'var(--bg)' : 'var(--fg)',
                border: 'none', cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: 2,
                transition: 'background 0.2s, color 0.2s',
                width: '100%',
              }}
            >
              {p.price10}€
            </button>
          </div>
        );
      })}

      {/* Mobile cards */}
      <div className="mobile-only">
        {filtered.map(p => (
          <div
            key={p.sku}
            onClick={() => goToProduct(p.sku)}
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--rule)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--teal)', letterSpacing: '0.06em', marginBottom: 2 }}>{p.sku}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--mute)', marginTop: 2 }}>{p.dose} · {p.purity}%</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700 }}>dès {p.price1}€</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 10 }}>
              {[[1, p.price1], [5, p.price5], [10, p.price10]].map(([qty, price]) => {
                const key = `${p.sku}-${qty}`;
                return (
                  <button
                    key={qty}
                    onClick={e => handleAddToCart(e, p, qty)}
                    style={{
                      padding: '8px 4px',
                      background: addedKey === key ? 'var(--teal)' : 'var(--panel)',
                      color: addedKey === key ? 'var(--bg)' : 'var(--fg)',
                      border: '1px solid var(--rule)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: '0.1em', opacity: 0.7 }}>×{qty}</div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700 }}>{price}€</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer ticker */}
      <div style={{
        background: 'var(--panel)',
        padding: '12px 28px',
        borderTop: '1px solid var(--rule)',
        fontFamily: 'Space Mono, monospace',
        fontSize: 10, color: 'var(--mute)',
        letterSpacing: '0.1em',
        display: 'flex', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
        alignItems: 'center',
      }}>
        <span>● LIVE · marché actif</span>
        <span>FR 8€ · EU 12€ · GRATUIT &gt; 150€</span>
        <Link href="/admin" style={{
          color: 'var(--teal)',
          border: '1px solid var(--teal-dim)',
          padding: '3px 9px',
          letterSpacing: '0.16em',
          textDecoration: 'none',
          fontSize: 10,
        }}>
          ↗ ADMIN
        </Link>
      </div>

    </div>
  );
}
