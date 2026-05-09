'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProduct } from '../../../lib/products';
import { useCart } from '../../../components/CartProvider';

const MoleculeSchematic = ({ teal, tealDim, rule, faint, mono }) => (
  <svg viewBox="0 0 400 360" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <g stroke={tealDim} strokeWidth="1" fill="none">
      <path d="M 50 180 Q 100 80, 200 180 T 350 180" />
      <path d="M 50 180 Q 100 280, 200 180 T 350 180" />
    </g>
    {[
      [50, 180, 'GLP'], [100, 140, 'GIP'], [200, 180, '•'],
      [300, 140, 'GCG'], [350, 180, 'OH'],
    ].map(([x, y, l], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={i === 2 ? 12 : 8} fill={i === 2 ? teal : 'var(--panel)'} stroke={teal} strokeWidth="1.5" />
        <text x={x} y={y + 24} textAnchor="middle" fontFamily={mono} fontSize="9" fill={faint}>{l}</text>
      </g>
    ))}
    <g stroke={rule} strokeWidth="0.5">
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={50 + i * 40} y1="320" x2={50 + i * 40} y2="328" />
      ))}
      <line x1="50" y1="328" x2="370" y2="328" />
    </g>
    <text x="50" y="346" fontFamily={mono} fontSize="9" fill={faint}>0</text>
    <text x="370" y="346" textAnchor="end" fontFamily={mono} fontSize="9" fill={faint}>aa39</text>
  </svg>
);

export default function ProductPage({ params }) {
  const router = useRouter();
  const product = getProduct(params.id);
  const { add } = useCart();
  const [selectedQty, setSelectedQty] = useState(5);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div style={{ padding: '60px 28px', textAlign: 'center', background: 'var(--bg)', minHeight: '60vh' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
          Produit introuvable
        </div>
        <Link href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: 16 }}>
          ← Retour au catalogue
        </Link>
      </div>
    );
  }

  const price = selectedQty === 1 ? product.price1 : selectedQty === 5 ? product.price5 : product.price10;
  const perUnit = Math.round(price / selectedQty);

  const handleAdd = () => {
    add(product, selectedQty, price);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const tiers = [
    { qty: 1, label: '×1', price: product.price1, unit: product.price1 },
    { qty: 5, label: '×5', price: product.price5, unit: Math.round(product.price5 / 5) },
    { qty: 10, label: '×10', price: product.price10, unit: Math.round(product.price10 / 10) },
  ];

  const specs = [
    ['PURETÉ HPLC', `${product.purity}%`, 'var(--teal)'],
    ['MASSE OBS.', '1612.81', 'var(--fg)'],
    ['ENDOTOXINES', '< 0.05 EU/mg', 'var(--green)'],
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '80vh' }}>
      {/* Breadcrumb */}
      <div style={{
        padding: '12px 28px', borderBottom: '1px solid var(--rule)',
        fontFamily: 'Space Mono, monospace', fontSize: 11,
        color: 'var(--mute)', letterSpacing: '0.12em',
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <Link href="/" style={{ color: 'var(--mute)', textDecoration: 'none' }}>CATALOGUE</Link>
        <span>—</span>
        <span style={{ color: 'var(--teal)' }}>{product.sku}</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0,
      }} className="product-grid">
        {/* Molecule side */}
        <div style={{
          background: 'var(--panel)',
          padding: '40px 36px',
          minHeight: 640,
          position: 'relative',
          borderRight: '1px solid var(--rule)',
        }}>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 10, color: 'var(--mute)',
            letterSpacing: '0.18em', marginBottom: 16,
          }}>
            STRUCTURE · MASSE 1612.84 g/mol
          </div>
          <div style={{ height: 'calc(100% - 100px)' }}>
            <MoleculeSchematic
              teal="var(--teal)"
              tealDim="var(--teal-dim)"
              rule="var(--rule)"
              faint="var(--faint)"
              mono="Space Mono, monospace"
            />
          </div>
          <div style={{
            position: 'absolute', bottom: 20, left: 36,
            fontFamily: 'Space Mono, monospace',
            fontSize: 10, color: 'var(--faint)',
            letterSpacing: '0.16em',
          }}>
            ↗ COA.PDF · MS.PDF · HPLC.PDF
          </div>
        </div>

        {/* Spec side */}
        <div style={{ padding: '40px 36px' }}>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11, color: 'var(--teal)',
            letterSpacing: '0.16em', marginBottom: 8,
          }}>
            {product.sku} · LOT {product.lot}-A
          </div>
          <h1 style={{
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            fontSize: 'clamp(36px, 4vw, 56px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            {product.name}
          </h1>
          <div style={{ color: 'var(--mute)', fontSize: 16, marginTop: 6 }}>
            {product.dose} / vial · lyophilisat
          </div>

          {/* Spec grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1, background: 'var(--rule)',
            border: '1px solid var(--rule)',
            marginTop: 22, marginBottom: 22,
          }}>
            {specs.map(([k, v, c]) => (
              <div key={k} style={{ background: 'var(--panel)', padding: '14px 16px' }}>
                <div style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 9, color: 'var(--mute)',
                  letterSpacing: '0.18em',
                }}>{k}</div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 26, fontWeight: 600,
                  color: c, marginTop: 4,
                }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Format picker */}
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 10, color: 'var(--mute)',
            letterSpacing: '0.18em', marginBottom: 10,
          }}>FORMAT</div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8, marginBottom: 22,
          }}>
            {tiers.map(({ qty, label, price: p, unit }) => (
              <button
                key={qty}
                onClick={() => setSelectedQty(qty)}
                style={{
                  padding: '14px 12px',
                  background: selectedQty === qty ? 'var(--teal)' : 'var(--panel)',
                  color: selectedQty === qty ? 'var(--bg)' : 'var(--fg)',
                  border: selectedQty === qty ? 'none' : '1px solid var(--rule)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                <div style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 11, letterSpacing: '0.16em',
                  opacity: 0.8,
                }}>{label}</div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 26, fontWeight: 700, marginTop: 4,
                }}>{p}€</div>
                <div style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 9, opacity: 0.7, marginTop: 4,
                }}>{unit}€/u</div>
              </button>
            ))}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            style={{
              width: '100%',
              background: added ? 'var(--green)' : 'var(--fg)',
              color: 'var(--bg)',
              padding: '16px 18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600, fontSize: 16,
              border: 'none', cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            <span>{added ? '✓ Ajouté au panier' : 'Ajouter au panier'}</span>
            <span style={{ fontFamily: 'Space Mono, monospace' }}>{price}€ →</span>
          </button>

          <Link href="/checkout" style={{
            display: 'block', marginTop: 10, textAlign: 'center',
            fontFamily: 'Space Mono, monospace',
            fontSize: 11, color: 'var(--mute)',
            textDecoration: 'none', letterSpacing: '0.12em',
          }}>
            Voir mon panier →
          </Link>
        </div>
      </div>

    </div>
  );
}
