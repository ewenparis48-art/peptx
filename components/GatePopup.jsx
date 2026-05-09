'use client';
import { useEffect, useState } from 'react';

export default function GatePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('peptx_gate_seen');
    if (!seen) setVisible(true);
  }, []);

  const enter = () => {
    localStorage.setItem('peptx_gate_seen', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ maxWidth: 600, width: '100%' }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 11, color: 'var(--teal)',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          marginBottom: 24,
        }}>
          ◆ PEPTX · AVERTISSEMENT IMPORTANT
        </div>

        <div style={{
          fontFamily: 'Space Grotesk, Inter, sans-serif',
          fontSize: 'clamp(32px, 6vw, 52px)',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          marginBottom: 24,
        }}>
          Ce site enregistre.<br />
          <span style={{ color: 'var(--teal)' }}>Telegram facture.</span>
        </div>

        <div style={{
          background: 'var(--panel)',
          border: '1px solid var(--teal-dim)',
          padding: '24px 28px',
          marginBottom: 28,
        }}>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 10, color: 'var(--teal)',
            letterSpacing: '0.18em', marginBottom: 14,
          }}>FONCTIONNEMENT DE LA BOUTIQUE</div>
          {[
            ['01', 'Commande ici', 'Tu choisis tes produits et valides ta commande sur ce site.'],
            ['02', 'Contact Telegram', 'On te contacte sur @zzptx dans les 2h pour confirmer.'],
            ['03', 'Règlement privé', 'Le paiement se fait en privé sur Telegram — jamais sur le site.'],
          ].map(([n, title, desc]) => (
            <div key={n} style={{
              display: 'flex', gap: 16, paddingBottom: 16,
              marginBottom: 16,
              borderBottom: n !== '03' ? '1px solid var(--rule)' : 'none',
            }}>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 18, fontWeight: 700,
                color: 'var(--teal)', minWidth: 32,
              }}>{n}</div>
              <div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600, fontSize: 15,
                  marginBottom: 4,
                }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--mute)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={enter} className="btn-primary" style={{ fontSize: 15, padding: '14px 28px' }}>
            Entrer dans le catalogue →
          </button>
          <a
            href="https://t.me/zzptx"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 12, color: 'var(--teal)',
              letterSpacing: '0.14em', textDecoration: 'none',
            }}
          >
            ✈ @zzptx sur Telegram
          </a>
        </div>

        <div style={{
          marginTop: 20,
          fontFamily: 'Space Mono, monospace',
          fontSize: 10, color: 'var(--faint)',
          letterSpacing: '0.14em', lineHeight: 1.7,
        }}>
          En accédant au catalogue, vous confirmez avoir pris connaissance des conditions
          d'utilisation et acceptez que le paiement s'effectue exclusivement via Telegram.
        </div>
      </div>
    </div>
  );
}
