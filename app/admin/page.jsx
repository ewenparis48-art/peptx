'use client';
import { useState, useEffect } from 'react';
import { products } from '../../lib/products';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'peptx2026';

const STATUS_COLORS = {
  'En attente': 'var(--amber)',
  'Confirmée': 'var(--teal)',
  'Expédiée': 'var(--green)',
  'Livrée': '#a380f0',
  'Annulée': 'var(--red)',
};

const DEMO_ORDERS = [
  { id: '#PX-A1B2', date: '2026-05-08T14:22:00Z', client: 'J. Dupont', telegram: '@jean44', items: '5×Rétatrutide 10mg · 2×BPC-157', subtotal: 350, shippingPrice: 8, discount: 0, referralCode: '', total: 358, status: 'En attente' },
  { id: '#PX-C3D4', date: '2026-05-07T10:05:00Z', client: 'M. Bernard', telegram: '@marieb', items: '1×GHK-CU 100mg', subtotal: 50, shippingPrice: 8, discount: 0, referralCode: '', total: 58, status: 'Expédiée' },
  { id: '#PX-E5F6', date: '2026-05-06T16:44:00Z', client: 'L. Petit', telegram: '@lp', items: '5×Tirzepatide 30mg', subtotal: 300, shippingPrice: 8, discount: 30, referralCode: 'NOVO44', total: 278, status: 'Confirmée' },
  { id: '#PX-G7H8', date: '2026-05-04T09:10:00Z', client: 'S. Moreau', telegram: '@smoreau', items: '10×HGH 36iu', subtotal: 430, shippingPrice: 0, discount: 0, referralCode: '', total: 430, status: 'Livrée' },
  { id: '#PX-I9J0', date: '2026-05-03T11:30:00Z', client: 'A. Roux', telegram: '@aroux', items: '1×Rétatrutide 20mg', subtotal: 90, shippingPrice: 8, discount: 0, referralCode: '', total: 98, status: 'Annulée' },
];

const DEMO_REFERRALS = [
  { code: 'NOVO44', owner: '@novo_44', filleuls: 12, credits: 60, ca: 1840 },
  { code: 'PEPTX10', owner: '@peptx_ref', filleuls: 4, credits: 20, ca: 620 },
];

const REFERRAL_USES = [
  { handle: '@karim_91', date: '03.05.2026', commandes: 3, ca: 15, code: 'NOVO44' },
  { handle: '@elise_pa', date: '08.05.2026', commandes: 2, ca: 10, code: 'NOVO44' },
  { handle: '@val_lyon', date: '11.05.2026', commandes: 5, ca: 25, code: 'NOVO44' },
];

// Login screen
function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');

  const attempt = () => {
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem('peptx_admin', '1');
      onLogin();
    } else {
      setErr('Mot de passe incorrect.');
    }
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--teal)', letterSpacing: '0.22em', marginBottom: 16 }}>
          ◆ PEPTX · ESPACE ADMIN
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 28 }}>
          Connexion
        </h1>
        <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 8 }}>
          MOT DE PASSE
        </label>
        <input
          type="password"
          className="px-input"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="••••••••"
          style={{ marginBottom: 8 }}
        />
        {err && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12 }}>{err}</div>}
        <button onClick={attempt} className="btn-primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center', fontSize: 14 }}>
          Accéder au dashboard →
        </button>
        <div style={{ marginTop: 16, fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--faint)', letterSpacing: '0.1em' }}>
          Accès réservé · PeptX Admin
        </div>
      </div>
    </div>
  );
}

// KPI tiles
function KpiGrid({ orders }) {
  const total = orders.reduce((s, o) => s + (o.status !== 'Annulée' ? o.total : 0), 0);
  const pending = orders.filter(o => o.status === 'En attente').length;
  const shipped = orders.filter(o => o.status === 'Expédiée').length;
  const avg = orders.length > 0 ? Math.round(total / orders.filter(o => o.status !== 'Annulée').length) : 0;

  const tiles = [
    ['CA TOTAL', `${total}€`, 'var(--teal)', '+12%'],
    ['COMMANDES', `${orders.length}`, 'var(--fg)', `+${orders.length}`],
    ['EN ATTENTE', `${pending}`, 'var(--amber)', '⚠'],
    ['EXPÉDIÉES', `${shipped}`, 'var(--green)', '↑'],
    ['PANIER MOY.', `${avg}€`, 'var(--fg)', ''],
  ];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 1, background: 'var(--rule)',
      borderBottom: '1px solid var(--rule)',
    }} className="kpi-grid">
      {tiles.map(([k, v, c, d]) => (
        <div key={k} style={{ background: 'var(--panel)', padding: '20px 20px' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--mute)', letterSpacing: '0.18em' }}>{k}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, color: c }}>{v}</span>
            {d && <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)' }}>{d}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Orders tab
function OrdersTab({ orders, setOrders }) {
  const updateStatus = (id, status) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, status } : o);
      // Update localStorage too
      try {
        const stored = JSON.parse(localStorage.getItem('peptx_orders') || '[]');
        const updatedStored = stored.map(o => o.id === id ? { ...o, status } : o);
        localStorage.setItem('peptx_orders', JSON.stringify(updatedStored));
      } catch {}
      return next;
    });
  };

  return (
    <>
      {/* Sparkline */}
      <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--mute)', letterSpacing: '0.16em' }}>30J · CA</span>
        <svg width="100%" height="40" style={{ flex: 1 }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const h = 12 + Math.sin(i * 0.7) * 10 + (i % 5) * 1.5;
            return <rect key={i} x={i * 30} y={40 - h} width="22" height={h} fill={i > 25 ? 'var(--teal)' : 'var(--teal-dim)'} />;
          })}
        </svg>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)' }}>
          {orders.reduce((s, o) => s + (o.status !== 'Annulée' ? o.total : 0), 0)}€
        </span>
      </div>

      {/* Table */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '100px 1.2fr 1fr 1.8fr 90px 1fr 120px',
        padding: '12px 28px',
        fontFamily: 'Space Mono, monospace', fontSize: 10,
        color: 'var(--faint)', letterSpacing: '0.16em',
        borderBottom: '1px solid var(--rule)',
      }} className="orders-header desktop-only">
        <span>ID</span>
        <span>CLIENT</span>
        <span>TELEGRAM</span>
        <span>PANIER</span>
        <span style={{ textAlign: 'right' }}>TOTAL</span>
        <span style={{ textAlign: 'right' }}>STATUT</span>
        <span style={{ textAlign: 'right' }}>ACTION</span>
      </div>

      {orders.map(o => (
        <div key={o.id}>
          {/* Desktop row */}
          <div
            className="desktop-only"
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1.2fr 1fr 1.8fr 90px 1fr 120px',
              padding: '14px 28px', borderBottom: '1px solid var(--rule)',
              alignItems: 'center', fontSize: 13,
            }}
          >
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--mute)' }}>{o.id}</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600 }}>{o.client}</span>
            <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--teal)', fontSize: 12 }}>{o.telegram}</span>
            <span style={{ color: 'var(--mute)', fontSize: 12 }}>{o.items}</span>
            <span style={{ textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700 }}>{o.total}€</span>
            <span style={{ textAlign: 'right', fontFamily: 'Space Mono, monospace', fontSize: 11, color: STATUS_COLORS[o.status] || 'var(--fg)', letterSpacing: '0.12em' }}>
              ● {o.status}
            </span>
            <select
              value={o.status}
              onChange={e => updateStatus(o.id, e.target.value)}
              style={{
                background: 'var(--panel)', border: '1px solid var(--rule)',
                color: 'var(--fg)', padding: '6px 8px',
                fontFamily: 'Space Mono, monospace', fontSize: 10,
                cursor: 'pointer', marginLeft: 'auto', display: 'block',
              }}
            >
              {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Mobile card */}
          <div className="mobile-only" style={{ padding: '14px 16px', borderBottom: '1px solid var(--rule)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)' }}>{o.id}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 600, marginTop: 2 }}>{o.client}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', marginTop: 2 }}>{o.telegram}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700 }}>{o.total}€</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: STATUS_COLORS[o.status], letterSpacing: '0.1em', marginTop: 4 }}>
                  ● {o.status}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 8 }}>{o.items}</div>
          </div>
        </div>
      ))}
    </>
  );
}

// Catalogue tab (read-only)
function CatalogueTab() {
  return (
    <div>
      <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--rule)', fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--mute)', letterSpacing: '0.12em' }}>
        ⚠ LECTURE SEULE · Modifie les produits directement dans ton système
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '90px 1.4fr 70px 80px 80px 80px 80px',
        padding: '10px 28px',
        fontFamily: 'Space Mono, monospace', fontSize: 10,
        color: 'var(--faint)', letterSpacing: '0.14em', textTransform: 'uppercase',
        borderBottom: '1px solid var(--rule)',
      }} className="desktop-only">
        <span>SKU</span><span>Composé</span><span>Dose</span><span>Pureté</span>
        <span style={{ textAlign: 'right' }}>×1</span>
        <span style={{ textAlign: 'right' }}>×5</span>
        <span style={{ textAlign: 'right' }}>×10</span>
      </div>
      {products.map((p, i) => (
        <div key={p.sku} style={{
          display: 'grid',
          gridTemplateColumns: '90px 1.4fr 70px 80px 80px 80px 80px',
          padding: '14px 28px', borderBottom: '1px solid var(--rule)',
          alignItems: 'center', fontSize: 13,
          background: i % 2 === 1 ? 'var(--panel)' : 'transparent',
        }} className="desktop-only">
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)' }}>{p.sku}</span>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 500 }}>{p.name}</span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--mute)' }}>{p.dose}</span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)' }}>{p.purity}%</span>
          <span style={{ textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontSize: 14 }}>{p.price1}€</span>
          <span style={{ textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontSize: 14 }}>{p.price5}€</span>
          <span style={{ textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontSize: 14 }}>{p.price10}€</span>
        </div>
      ))}
    </div>
  );
}

// Referrals tab
function ParrainageTab({ orders }) {
  const referralStats = {};
  orders.forEach(o => {
    if (o.referralCode) {
      if (!referralStats[o.referralCode]) {
        referralStats[o.referralCode] = { code: o.referralCode, commandes: 0, ca: 0, clients: [] };
      }
      referralStats[o.referralCode].commandes++;
      referralStats[o.referralCode].ca += o.total;
      referralStats[o.referralCode].clients.push(o.telegram);
    }
  });

  // Merge with demo data
  const allReferrals = [...DEMO_REFERRALS];

  return (
    <div>
      {/* Header */}
      <div style={{ padding: '28px 28px 0' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.18em', marginBottom: 12 }}>
          ◆ PROGRAMME DE PARRAINAGE
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 24 }}>
          Parrains actifs.
        </h2>
      </div>

      {/* Referral summary tiles */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1, background: 'var(--rule)',
        borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)',
      }}>
        {[
          ['CODES ACTIFS', `${allReferrals.length}`, 'var(--fg)'],
          ['TOTAL FILLEULS', `${allReferrals.reduce((s, r) => s + r.filleuls, 0)}`, 'var(--teal)'],
          ['CA GÉNÉRÉ', `${allReferrals.reduce((s, r) => s + r.ca, 0)}€`, 'var(--fg)'],
        ].map(([k, v, c]) => (
          <div key={k} style={{ background: 'var(--panel)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--mute)', letterSpacing: '0.18em' }}>{k}</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, color: c, marginTop: 8 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Referral codes */}
      {allReferrals.map(r => (
        <div key={r.code} style={{
          margin: '20px 28px 0',
          background: 'var(--panel)', border: '1px solid var(--rule)',
          padding: '24px 28px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.18em', marginBottom: 4 }}>CODE</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 36, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.08em' }}>{r.code}</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>{r.owner}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'right' }}>
              {[['FILLEULS', r.filleuls, 'var(--fg)'], ['CRÉDITS', `${r.credits}€`, 'var(--teal)'], ['CA', `${r.ca}€`, 'var(--fg)']].map(([l, v, c]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 4 }}>{l}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent referrals for this code */}
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 14 }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.18em', marginBottom: 8 }}>FILLEULS RÉCENTS</div>
            {REFERRAL_USES.filter(u => u.code === r.code).map(u => (
              <div key={u.handle} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 70px 70px',
                padding: '10px 0', borderBottom: '1px solid var(--rule)',
                alignItems: 'center', fontSize: 13,
              }}>
                <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--teal)', fontSize: 12 }}>{u.handle}</span>
                <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--mute)', fontSize: 11 }}>{u.date}</span>
                <span style={{ textAlign: 'right', fontFamily: 'Space Mono, monospace', color: 'var(--mute)', fontSize: 11 }}>{u.commandes} cmd</span>
                <span style={{ textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>{u.ca}€</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ height: 32 }} />
    </div>
  );
}

// Main admin
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('commandes');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem('peptx_admin')) setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) {
      try {
        const stored = JSON.parse(localStorage.getItem('peptx_orders') || '[]');
        setOrders([...DEMO_ORDERS, ...stored]);
      } catch {
        setOrders(DEMO_ORDERS);
      }
    }
  }, [authed]);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const TABS = [
    ['commandes', '◆ Commandes'],
    ['catalogue', 'Catalogue'],
    ['parrainage', 'Parrainage'],
    ['reglages', 'Réglages'],
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '80vh' }}>
      {/* Sub-nav */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--rule)',
        padding: '0 28px', fontSize: 13, overflowX: 'auto',
      }}>
        {TABS.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding: '14px 18px',
              color: tab === k ? 'var(--fg)' : 'var(--mute)',
              borderBottom: tab === k ? '2px solid var(--teal)' : '2px solid transparent',
              marginBottom: -1, background: 'transparent',
              border: 'none',
              borderBottom: tab === k ? '2px solid var(--teal)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16, padding: '0 0 0 20px' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--teal)', letterSpacing: '0.14em' }}>
            ● ADMIN CONNECTÉ
          </span>
          <button
            onClick={() => { sessionStorage.removeItem('peptx_admin'); setAuthed(false); }}
            style={{ background: 'transparent', border: 'none', color: 'var(--mute)', fontSize: 11, cursor: 'pointer', fontFamily: 'Space Mono, monospace' }}
          >
            DÉCONNEXION
          </button>
        </div>
      </div>

      {/* KPIs */}
      {tab === 'commandes' && <KpiGrid orders={orders} />}

      {/* Tab content */}
      {tab === 'commandes' && <OrdersTab orders={orders} setOrders={setOrders} />}
      {tab === 'catalogue' && <CatalogueTab />}
      {tab === 'parrainage' && <ParrainageTab orders={orders} />}
      {tab === 'reglages' && (
        <div style={{ padding: '40px 28px' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.18em', marginBottom: 12 }}>
            ◆ RÉGLAGES
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 600, marginBottom: 28 }}>Paramètres admin.</h2>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--rule)', padding: '24px', maxWidth: 500 }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 12 }}>
              CONTACT TELEGRAM
            </div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 18, color: 'var(--teal)' }}>@zzptx</div>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--rule)' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 8 }}>
                NOTE
              </div>
              <div style={{ fontSize: 13, color: 'var(--mute)', lineHeight: 1.6 }}>
                Le catalogue et les prix se gèrent directement dans <code style={{ fontFamily: 'Space Mono, monospace', color: 'var(--teal)' }}>lib/products.js</code>.
                La base de données n'est pas modifiée via cette interface.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
