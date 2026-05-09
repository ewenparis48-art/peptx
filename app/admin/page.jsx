'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { products } from '../../lib/products';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'BibietPipi';

const STATUS_COLORS = {
  'En attente': 'var(--amber)',
  'Confirmée': 'var(--teal)',
  'Expédiée': 'var(--green)',
  'Livrée': '#a380f0',
  'Annulée': 'var(--red)',
};

// ─── Login ───
function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const attempt = () => {
    if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem('peptx_admin', '1'); onLogin(); }
    else setErr('Mot de passe incorrect.');
  };
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--teal)', letterSpacing: '0.22em', marginBottom: 16 }}>◆ PEPTX · ESPACE ADMIN</div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 28 }}>Connexion</h1>
        <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 8 }}>MOT DE PASSE</label>
        <input type="password" className="px-input" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === 'Enter' && attempt()} placeholder="••••••••" style={{ marginBottom: 8 }} />
        {err && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12 }}>{err}</div>}
        <button onClick={attempt} className="btn-primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>Accéder →</button>
      </div>
    </div>
  );
}

// ─── KPI tiles ───
function KpiGrid({ orders }) {
  const valid = orders.filter(o => o.status !== 'Annulée');
  const ca = valid.reduce((s, o) => s + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === 'En attente').length;
  const shipped = orders.filter(o => o.status === 'Expédiée').length;
  const avg = valid.length ? Math.round(ca / valid.length) : 0;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--rule)', borderBottom: '1px solid var(--rule)' }} className="kpi-grid">
      {[
        ['CA TOTAL', `${ca}€`, 'var(--teal)'],
        ['COMMANDES', `${orders.length}`, 'var(--fg)'],
        ['EN ATTENTE', `${pending}`, 'var(--amber)'],
        ['EXPÉDIÉES', `${shipped}`, 'var(--green)'],
        ['PANIER MOY.', `${avg}€`, 'var(--fg)'],
      ].map(([k, v, c]) => (
        <div key={k} style={{ background: 'var(--panel)', padding: '20px' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--mute)', letterSpacing: '0.18em' }}>{k}</div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, color: c, marginTop: 6 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Order detail modal ───
function OrderModal({ order, onClose, onStatusChange }) {
  if (!order) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--panel)', border: '1px solid var(--rule)', maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--teal)', letterSpacing: '0.18em', marginBottom: 4 }}>COMMANDE</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700 }}>#{order.id}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--mute)', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Client */}
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 10 }}>CLIENT</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{order.prenom} {order.nom}</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 13, color: 'var(--teal)', marginBottom: 4 }}>{order.telegram}</div>
            {order.email && <div style={{ fontSize: 12, color: 'var(--mute)' }}>{order.email}</div>}
          </div>

          {/* Adresse */}
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 10 }}>LIVRAISON À</div>
            <div style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.7 }}>
              {order.adresse}<br />
              {order.complement && <>{order.complement}<br /></>}
              {order.cp} {order.ville}<br />
              {order.pays}
            </div>
          </div>

          {/* Articles */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 10 }}>ARTICLES</div>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--rule)', padding: '12px 16px', fontSize: 13, color: 'var(--fg)', lineHeight: 1.7 }}>
              {order.items}
            </div>
          </div>

          {/* Livraison + Code */}
          <div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 10 }}>LIVRAISON</div>
            <div style={{ fontSize: 13 }}>{order.shipping_method} — {order.shipping_price === 0 ? 'Gratuit' : `${order.shipping_price}€`}</div>
          </div>

          {order.referral_code && (
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 10 }}>CODE PARRAIN</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 16, color: 'var(--teal)', fontWeight: 700 }}>{order.referral_code}</div>
              <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 2 }}>−{order.discount}€ appliqué</div>
            </div>
          )}

          {/* Total */}
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--rule)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 6 }}>DATE</div>
              <div style={{ fontSize: 13, color: 'var(--mute)' }}>{new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, color: 'var(--teal)' }}>{order.total}€</div>
            </div>
          </div>

          {/* Status selector */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 8 }}>STATUT</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.keys(STATUS_COLORS).map(s => (
                <button key={s} onClick={() => onStatusChange(order.id, s)} style={{
                  padding: '8px 14px',
                  background: order.status === s ? STATUS_COLORS[s] : 'var(--bg)',
                  color: order.status === s ? '#000' : STATUS_COLORS[s],
                  border: `1px solid ${STATUS_COLORS[s]}`,
                  fontFamily: 'Space Mono, monospace', fontSize: 11,
                  letterSpacing: '0.1em', cursor: 'pointer',
                  opacity: order.status === s ? 1 : 0.6,
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Orders tab ───
function OrdersTab({ orders, setOrders }) {
  const [selected, setSelected] = useState(null);

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  };

  const ca = orders.filter(o => o.status !== 'Annulée').reduce((s, o) => s + (o.total || 0), 0);

  return (
    <>
      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} />}

      {/* Sparkline */}
      <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--mute)', letterSpacing: '0.16em' }}>30J · CA</span>
        <svg width="100%" height="40" style={{ flex: 1 }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const h = 10 + Math.sin(i * 0.7) * 10 + (i % 5) * 1.5;
            return <rect key={i} x={i * 30} y={40 - h} width="22" height={h} fill={i > 25 ? 'var(--teal)' : 'var(--teal-dim)'} />;
          })}
        </svg>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)' }}>{ca}€</span>
      </div>

      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1.8fr 90px 1fr', padding: '12px 28px', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--faint)', letterSpacing: '0.16em', borderBottom: '1px solid var(--rule)' }} className="orders-header desktop-only">
        <span>ID</span><span>CLIENT</span><span>TELEGRAM</span><span>ARTICLES</span><span style={{ textAlign: 'right' }}>TOTAL</span><span style={{ textAlign: 'right' }}>STATUT</span>
      </div>

      {orders.length === 0 && (
        <div style={{ padding: '40px 28px', textAlign: 'center', color: 'var(--mute)', fontFamily: 'Space Mono, monospace', fontSize: 12 }}>
          Aucune commande pour l'instant.
        </div>
      )}

      {orders.map(o => (
        <div key={o.id}>
          {/* Desktop */}
          <div className="table-row desktop-only" onClick={() => setSelected(o)} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1.8fr 90px 1fr', padding: '14px 28px', borderBottom: '1px solid var(--rule)', alignItems: 'center', fontSize: 13, cursor: 'pointer' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--mute)' }}>{o.id}</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600 }}>{o.prenom} {o.nom}</span>
            <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--teal)', fontSize: 12 }}>{o.telegram}</span>
            <span style={{ color: 'var(--mute)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.items}</span>
            <span style={{ textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700 }}>{o.total}€</span>
            <span style={{ textAlign: 'right', fontFamily: 'Space Mono, monospace', fontSize: 11, color: STATUS_COLORS[o.status] || 'var(--fg)', letterSpacing: '0.12em' }}>● {o.status}</span>
          </div>

          {/* Mobile */}
          <div className="mobile-only" onClick={() => setSelected(o)} style={{ padding: '14px 16px', borderBottom: '1px solid var(--rule)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)' }}>{o.id}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 600, marginTop: 2 }}>{o.prenom} {o.nom}</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', marginTop: 2 }}>{o.telegram}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700 }}>{o.total}€</div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: STATUS_COLORS[o.status], marginTop: 4 }}>● {o.status}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 8 }}>{o.items}</div>
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Catalogue tab ───
function CatalogueTab() {
  return (
    <div>
      <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--rule)', fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--mute)', letterSpacing: '0.12em' }}>
        ⚠ LECTURE SEULE · Modifie les produits dans lib/products.js
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 70px 80px 80px 80px 80px', padding: '10px 28px', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--faint)', letterSpacing: '0.14em', textTransform: 'uppercase', borderBottom: '1px solid var(--rule)' }} className="desktop-only">
        <span>SKU</span><span>Composé</span><span>Dose</span><span>Pureté</span><span style={{ textAlign: 'right' }}>×1</span><span style={{ textAlign: 'right' }}>×5</span><span style={{ textAlign: 'right' }}>×10</span>
      </div>
      {products.map((p, i) => (
        <div key={p.sku} style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 70px 80px 80px 80px 80px', padding: '14px 28px', borderBottom: '1px solid var(--rule)', alignItems: 'center', background: i % 2 === 1 ? 'var(--panel)' : 'transparent' }} className="desktop-only">
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

// ─── Parrainage tab ───
function ParrainageTab() {
  const [membres, setMembres] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: m }, { data: h }] = await Promise.all([
        supabase.from('membres').select('*').order('created_at', { ascending: false }),
        supabase.from('historique').select('*').order('date', { ascending: false }).limit(50),
      ]);
      setMembres(m || []);
      setHistorique(h || []);
      setLoading(false);
    };
    load();
  }, []);

  const totalCredits = membres.reduce((s, m) => s + (m.credits || 0), 0);
  const totalAchats = membres.reduce((s, m) => s + (m.achats || 0), 0);

  if (loading) return <div style={{ padding: '40px 28px', fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'var(--mute)' }}>Chargement...</div>;

  return (
    <div>
      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--rule)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
        {[
          ['MEMBRES', membres.length, 'var(--fg)'],
          ['CRÉDITS TOTAUX', `${totalCredits}€`, 'var(--teal)'],
          ['ACHATS TRACÉS', totalAchats, 'var(--fg)'],
        ].map(([k, v, c]) => (
          <div key={k} style={{ background: 'var(--panel)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'var(--mute)', letterSpacing: '0.18em' }}>{k}</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 36, fontWeight: 700, color: c, marginTop: 8 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Membres table */}
      <div style={{ padding: '24px 28px 0' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.18em', marginBottom: 12 }}>MEMBRES</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px 80px', padding: '10px 28px', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--faint)', letterSpacing: '0.14em', borderBottom: '1px solid var(--rule)' }} className="desktop-only">
        <span>USERNAME</span><span>CODE</span><span>PARRAIN</span><span style={{ textAlign: 'right' }}>ACHATS</span><span style={{ textAlign: 'right' }}>CRÉDITS</span>
      </div>

      {membres.length === 0 && (
        <div style={{ padding: '24px 28px', color: 'var(--mute)', fontFamily: 'Space Mono, monospace', fontSize: 12 }}>Aucun membre enregistré.</div>
      )}

      {membres.map(m => (
        <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px 80px', padding: '14px 28px', borderBottom: '1px solid var(--rule)', alignItems: 'center', fontSize: 13 }} className="desktop-only">
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{m.username}</span>
          <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--teal)', fontSize: 12 }}>{m.code}</span>
          <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--mute)', fontSize: 12 }}>{m.parrain || '—'}</span>
          <span style={{ textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>{m.achats}</span>
          <span style={{ textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--teal)' }}>{m.credits}€</span>
        </div>
      ))}

      {/* Historique */}
      <div style={{ padding: '28px 28px 0' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.18em', marginBottom: 12 }}>HISTORIQUE RÉCENT</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 80px 80px', padding: '10px 28px', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--faint)', letterSpacing: '0.14em', borderBottom: '1px solid var(--rule)' }} className="desktop-only">
        <span>DATE</span><span>TYPE</span><span>MEMBRE</span><span style={{ textAlign: 'right' }}>MONTANT</span><span style={{ textAlign: 'right' }}>CRÉDITS</span>
      </div>

      {historique.length === 0 && (
        <div style={{ padding: '24px 28px', color: 'var(--mute)', fontFamily: 'Space Mono, monospace', fontSize: 12 }}>Aucun historique.</div>
      )}

      {historique.map(h => (
        <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr 80px 80px', padding: '12px 28px', borderBottom: '1px solid var(--rule)', alignItems: 'center', fontSize: 13 }} className="desktop-only">
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--mute)' }}>{new Date(h.date).toLocaleDateString('fr-FR')}</span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: h.type === 'parrainage' ? 'var(--teal)' : h.type === 'achat' ? 'var(--green)' : 'var(--amber)', letterSpacing: '0.1em' }}>● {h.type}</span>
          <span style={{ color: 'var(--mute)', fontSize: 12 }}>{h.membre}{h.note ? ` · ${h.note}` : ''}</span>
          <span style={{ textAlign: 'right', fontSize: 13 }}>{h.montant ? `${h.montant}€` : '—'}</span>
          <span style={{ textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--teal)' }}>+{h.credits}€</span>
        </div>
      ))}
      <div style={{ height: 32 }} />
    </div>
  );
}

// ─── Main admin ───
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('commandes');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('peptx_admin')) setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    const load = async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    load();
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
      <div style={{ display: 'flex', borderBottom: '1px solid var(--rule)', padding: '0 28px', fontSize: 13, overflowX: 'auto' }}>
        {TABS.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} style={{ padding: '14px 18px', color: tab === k ? 'var(--fg)' : 'var(--mute)', borderBottom: tab === k ? '2px solid var(--teal)' : '2px solid transparent', background: 'transparent', border: 'none', borderBottom: tab === k ? '2px solid var(--teal)' : '2px solid transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13, whiteSpace: 'nowrap' }}>
            {label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16, padding: '0 0 0 20px' }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--teal)', letterSpacing: '0.14em' }}>● ADMIN</span>
          <button onClick={() => { sessionStorage.removeItem('peptx_admin'); setAuthed(false); }} style={{ background: 'transparent', border: 'none', color: 'var(--mute)', fontSize: 11, cursor: 'pointer', fontFamily: 'Space Mono, monospace' }}>DÉCO</button>
        </div>
      </div>

      {tab === 'commandes' && <KpiGrid orders={orders} />}

      {tab === 'commandes' && (loading
        ? <div style={{ padding: '40px 28px', fontFamily: 'Space Mono, monospace', fontSize: 12, color: 'var(--mute)' }}>Chargement des commandes...</div>
        : <OrdersTab orders={orders} setOrders={setOrders} />
      )}
      {tab === 'catalogue' && <CatalogueTab />}
      {tab === 'parrainage' && <ParrainageTab />}
      {tab === 'reglages' && (
        <div style={{ padding: '40px 28px' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.18em', marginBottom: 12 }}>◆ RÉGLAGES</div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 600, marginBottom: 28 }}>Paramètres admin.</h2>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--rule)', padding: '24px', maxWidth: 500 }}>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 8 }}>TELEGRAM</div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 18, color: 'var(--teal)' }}>@zzptx</div>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--rule)', fontSize: 13, color: 'var(--mute)', lineHeight: 1.7 }}>
              Produits → <code style={{ color: 'var(--teal)' }}>lib/products.js</code><br />
              Base de données → Supabase (lecture seule ici)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
