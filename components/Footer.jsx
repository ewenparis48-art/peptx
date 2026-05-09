'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--panel)',
      borderTop: '1px solid var(--rule)',
      marginTop: 'auto',
    }}>
      {/* Main footer content */}
      <div style={{
        padding: '40px 28px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 32,
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: 20,
            letterSpacing: '-0.02em', marginBottom: 10,
          }}>
            Pept<span style={{ color: 'var(--teal)' }}>X</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--mute)', lineHeight: 1.7, maxWidth: 260 }}>
            Recherche, pureté, traçabilité. Chaque commande est enregistrée ici,
            le règlement s'effectue en privé sur Telegram.
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 10, color: 'var(--faint)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: 14,
          }}>Navigation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/" style={{ color: 'var(--mute)', textDecoration: 'none', fontSize: 13 }}>Catalogue</Link>
            <Link href="/checkout" style={{ color: 'var(--mute)', textDecoration: 'none', fontSize: 13 }}>Mon panier</Link>
            <Link href="/cgv" style={{ color: 'var(--mute)', textDecoration: 'none', fontSize: 13 }}>
              Conditions générales de vente
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 10, color: 'var(--faint)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: 14,
          }}>Contact</div>
          <a
            href="https://t.me/zzptx"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'var(--teal)', textDecoration: 'none', fontSize: 14,
              fontFamily: 'Space Mono, monospace', letterSpacing: '0.06em',
            }}
          >
            ✈ @zzptx
          </a>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--mute)', lineHeight: 1.6 }}>
            Disponible sur Telegram<br />
            Réponse sous 2h en général
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 10, color: 'var(--faint)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: 14,
          }}>Paiement</div>
          <div style={{ fontSize: 12, color: 'var(--mute)', lineHeight: 1.7 }}>
            Le paiement ne s'effectue <strong style={{ color: 'var(--fg)' }}>pas</strong> sur ce site.<br />
            Contact Telegram après validation de ta commande.
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--rule)',
        padding: '16px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 10, color: 'var(--faint)',
          letterSpacing: '0.12em',
        }}>
          © 2026 PeptX · Tous droits réservés
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/cgv" style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 10, color: 'var(--faint)',
            textDecoration: 'none', letterSpacing: '0.12em',
            transition: 'color 0.2s',
          }}>
            CGV
          </Link>
          <a
            href="https://t.me/zzptx"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 10, color: 'var(--teal)',
              textDecoration: 'none', letterSpacing: '0.12em',
            }}
          >
            CONTACT
          </a>
        </div>
      </div>
    </footer>
  );
}
