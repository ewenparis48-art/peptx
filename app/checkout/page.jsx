'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../components/CartProvider';
import { supabase } from '../../lib/supabase';

const STEPS = ['Articles', 'Contact', 'Adresse', 'Livraison', 'Code parrain', 'Confirmation'];

const SHIPPING = [
  { id: 'mondial', label: 'MONDIAL RELAY', desc: 'Point relais · 4–5j ouvrés', price: 8, badge: 'Le moins cher' },
  { id: 'colissimo', label: 'COLISSIMO', desc: 'Domicile · 48h · suivi', price: 8, badge: 'Recommandé' },
  { id: 'chronopost', label: 'CHRONOPOST', desc: 'Express · 24h · signature', price: 18, badge: '' },
  { id: 'main', label: 'MAIN PROPRE', desc: 'Paris uniquement · sur RDV', price: 0, badge: 'Sécurisé' },
];

const Stepper = ({ active }) => (
  <div style={{
    padding: '18px 28px',
    borderBottom: '1px solid var(--rule)',
    display: 'flex', alignItems: 'center', gap: 10,
    fontFamily: 'Space Mono, monospace', fontSize: 11,
    color: 'var(--mute)', overflowX: 'auto',
    flexWrap: 'nowrap',
  }}>
    {STEPS.map((s, i) => (
      <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
        <span style={{
          color: i < active ? 'var(--fg)' : i === active ? 'var(--teal)' : 'var(--mute)',
          letterSpacing: '0.12em',
        }}>
          {i < active ? '✓' : i === active ? '◆' : '○'}{' '}
          {String(i + 1).padStart(2, '0')}
          <span className="desktop-only" style={{ marginLeft: 6 }}>{s}</span>
        </span>
        {i < STEPS.length - 1 && <span style={{ color: 'var(--faint)' }}>—</span>}
      </span>
    ))}
  </div>
);

const RecapPanel = ({ items, total, shippingPrice, shippingLabel, discount, discountLabel }) => {
  const sub = items.reduce((s, i) => s + i.unitPrice * i.count, 0);
  const grand = sub + (shippingPrice || 0) - (discount || 0);
  return (
    <div style={{
      background: 'var(--panel)',
      padding: 20, border: '1px solid var(--rule)',
      alignSelf: 'start', position: 'sticky', top: 80,
    }}>
      <div style={{
        fontFamily: 'Space Mono, monospace',
        fontSize: 10, color: 'var(--mute)',
        letterSpacing: '0.18em', marginBottom: 10,
      }}>RÉCAP COMMANDE</div>
      {items.map(i => (
        <div key={i.key} style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '10px 0', borderBottom: '1px solid var(--rule)',
          fontSize: 13,
        }}>
          <span style={{ color: 'var(--mute)' }}>{i.count}× {i.name} {i.dose} (×{i.qty})</span>
          <span style={{ fontFamily: 'Space Mono, monospace' }}>{(i.unitPrice * i.count)}€</span>
        </div>
      ))}
      {shippingLabel && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '10px 0', borderBottom: '1px solid var(--rule)', fontSize: 13,
        }}>
          <span style={{ color: 'var(--mute)' }}>Livraison {shippingLabel}</span>
          <span style={{ fontFamily: 'Space Mono, monospace' }}>{shippingPrice === 0 ? 'Gratuit' : `${shippingPrice}€`}</span>
        </div>
      )}
      {discount > 0 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '10px 0', borderBottom: '1px solid var(--rule)', fontSize: 13,
        }}>
          <span style={{ color: 'var(--teal)' }}>{discountLabel}</span>
          <span style={{ fontFamily: 'Space Mono, monospace', color: 'var(--teal)' }}>-{discount}€</span>
        </div>
      )}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        paddingTop: 12,
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 22, fontWeight: 700,
      }}>
        <span>Total</span>
        <span style={{ color: 'var(--teal)' }}>{grand}€</span>
      </div>
      <div style={{
        marginTop: 14, padding: '10px 12px',
        border: '1px solid var(--teal-dim)',
        fontFamily: 'Space Mono, monospace',
        fontSize: 10, color: 'var(--teal)',
        letterSpacing: '0.14em', lineHeight: 1.6,
      }}>
        ✈ PAIEMENT VIA TELEGRAM<br />
        <span style={{ color: 'var(--mute)' }}>après confirmation de la commande</span>
      </div>
    </div>
  );
};

// Step 1: Articles
const StepArticles = ({ items, update, remove, onNext }) => {
  if (items.length === 0) {
    return (
      <div style={{ padding: '60px 28px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
          Panier vide
        </div>
        <Link href="/" className="btn-primary" style={{ display: 'inline-block' }}>
          ← Retour au catalogue
        </Link>
      </div>
    );
  }
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 11,
          color: 'var(--teal)', letterSpacing: '0.18em', marginBottom: 8,
        }}>STEP 01 · ARTICLES</div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Ton panier.
        </h2>
      </div>

      {items.map(item => (
        <div key={item.key} style={{
          padding: '16px 0', borderBottom: '1px solid var(--rule)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 600 }}>
              {item.name} <span style={{ color: 'var(--mute)', fontWeight: 400 }}>{item.dose}</span>
            </div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', marginTop: 2 }}>
              ×{item.qty} · {item.unitPrice}€/lot
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => update(item.key, item.count - 1)}
              style={{ width: 30, height: 30, border: '1px solid var(--rule)', background: 'var(--panel)', color: 'var(--fg)', cursor: 'pointer', fontSize: 16 }}>
              −
            </button>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 13, minWidth: 20, textAlign: 'center' }}>{item.count}</span>
            <button onClick={() => update(item.key, item.count + 1)}
              style={{ width: 30, height: 30, border: '1px solid var(--rule)', background: 'var(--panel)', color: 'var(--fg)', cursor: 'pointer', fontSize: 16 }}>
              +
            </button>
          </div>
          <div style={{ textAlign: 'right', minWidth: 70 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 700 }}>
              {item.unitPrice * item.count}€
            </div>
            <button onClick={() => remove(item.key)}
              style={{ background: 'transparent', border: 'none', color: 'var(--red)', fontSize: 11, cursor: 'pointer', fontFamily: 'Space Mono, monospace' }}>
              retirer
            </button>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Link href="/" className="btn-ghost">← Catalogue</Link>
        <button onClick={onNext} className="btn-primary">Continuer → Contact</button>
      </div>
    </div>
  );
};

// Step 2: Contact
const StepContact = ({ data, setData, onNext, onPrev }) => {
  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!data.prenom.trim()) e.prenom = 'Requis';
    if (!data.nom.trim()) e.nom = 'Requis';
    if (!data.telegram.trim()) e.telegram = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.18em', marginBottom: 8 }}>STEP 02 · CONTACT</div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em' }}>Tes coordonnées.</h2>
        <p style={{ fontSize: 13, color: 'var(--mute)', marginTop: 6, lineHeight: 1.6 }}>
          Telegram est obligatoire — c'est par là qu'on te contactera pour le règlement.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 6 }}>
            PRÉNOM *
          </label>
          <input
            className="px-input"
            value={data.prenom}
            onChange={e => setData({ ...data, prenom: e.target.value })}
            placeholder="Jean"
          />
          {errors.prenom && <span style={{ fontSize: 11, color: 'var(--red)' }}>{errors.prenom}</span>}
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 6 }}>
            NOM *
          </label>
          <input
            className="px-input"
            value={data.nom}
            onChange={e => setData({ ...data, nom: e.target.value })}
            placeholder="Dupont"
          />
          {errors.nom && <span style={{ fontSize: 11, color: 'var(--red)' }}>{errors.nom}</span>}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 6 }}>
          TELEGRAM * <span style={{ color: 'var(--faint)' }}>(handle @username)</span>
        </label>
        <input
          className="px-input"
          value={data.telegram}
          onChange={e => setData({ ...data, telegram: e.target.value })}
          placeholder="@tonhandle"
        />
        {errors.telegram && <span style={{ fontSize: 11, color: 'var(--red)' }}>{errors.telegram}</span>}
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 6 }}>
          EMAIL <span style={{ color: 'var(--faint)' }}>(optionnel)</span>
        </label>
        <input
          className="px-input"
          type="email"
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
          placeholder="jean@example.com"
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onPrev} className="btn-ghost">← Articles</button>
        <button onClick={() => validate() && onNext()} className="btn-primary">Continuer → Adresse</button>
      </div>
    </div>
  );
};

// Step 3: Adresse
const StepAdresse = ({ data, setData, onNext, onPrev }) => {
  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!data.adresse.trim()) e.adresse = 'Requis';
    if (!data.ville.trim()) e.ville = 'Requis';
    if (!data.cp.trim()) e.cp = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.18em', marginBottom: 8 }}>STEP 03 · ADRESSE</div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em' }}>Adresse de livraison.</h2>
        <p style={{ fontSize: 13, color: 'var(--mute)', marginTop: 6 }}>France métropole. Autre pays : devis sur Telegram.</p>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 6 }}>
          ADRESSE *
        </label>
        <input className="px-input" value={data.adresse} onChange={e => setData({ ...data, adresse: e.target.value })} placeholder="12 rue de la Paix" />
        {errors.adresse && <span style={{ fontSize: 11, color: 'var(--red)' }}>{errors.adresse}</span>}
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 6 }}>
          COMPLÉMENT <span style={{ color: 'var(--faint)' }}>(optionnel)</span>
        </label>
        <input className="px-input" value={data.complement} onChange={e => setData({ ...data, complement: e.target.value })} placeholder="Bât. B, Apt. 12" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 6 }}>CODE POSTAL *</label>
          <input className="px-input" value={data.cp} onChange={e => setData({ ...data, cp: e.target.value })} placeholder="75001" />
          {errors.cp && <span style={{ fontSize: 11, color: 'var(--red)' }}>{errors.cp}</span>}
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 6 }}>VILLE *</label>
          <input className="px-input" value={data.ville} onChange={e => setData({ ...data, ville: e.target.value })} placeholder="Paris" />
          {errors.ville && <span style={{ fontSize: 11, color: 'var(--red)' }}>{errors.ville}</span>}
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.14em', marginBottom: 6 }}>PAYS</label>
          <input className="px-input" value={data.pays} onChange={e => setData({ ...data, pays: e.target.value })} placeholder="France" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onPrev} className="btn-ghost">← Contact</button>
        <button onClick={() => validate() && onNext()} className="btn-primary">Continuer → Livraison</button>
      </div>
    </div>
  );
};

// Step 4: Livraison
const StepLivraison = ({ selectedShipping, setShipping, onNext, onPrev }) => (
  <div>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.18em', marginBottom: 8 }}>STEP 04 · LIVRAISON</div>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em' }}>Mode d'envoi.</h2>
      <p style={{ fontSize: 13, color: 'var(--mute)', marginTop: 6, lineHeight: 1.6 }}>
        Tarifs France métropole. Hors France : devis sur Telegram.
      </p>
    </div>

    {SHIPPING.map(s => (
      <div
        key={s.id}
        onClick={() => setShipping(s.id)}
        style={{
          padding: '18px 20px', marginBottom: 10,
          background: selectedShipping === s.id ? 'var(--panel-hi)' : 'var(--panel)',
          border: `1px solid ${selectedShipping === s.id ? 'var(--teal)' : 'var(--rule)'}`,
          display: 'flex', alignItems: 'center', gap: 14,
          cursor: 'pointer', transition: 'border-color 0.2s',
        }}
      >
        <div className={`radio-outer${selectedShipping === s.id ? ' selected' : ''}`}>
          {selectedShipping === s.id && <div className="radio-inner" />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'Space Mono, monospace', fontSize: 11,
              color: selectedShipping === s.id ? 'var(--teal)' : 'var(--fg)',
              letterSpacing: '0.14em',
            }}>{s.label}</span>
            {s.badge && (
              <span style={{
                fontFamily: 'Space Mono, monospace', fontSize: 9,
                padding: '2px 6px', border: '1px solid var(--teal-dim)',
                color: 'var(--teal)', letterSpacing: '0.1em',
              }}>{s.badge}</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 4 }}>{s.desc}</div>
        </div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 600, minWidth: 60, textAlign: 'right' }}>
          {s.price === 0 ? 'Gratuit' : `${s.price}€`}
        </div>
      </div>
    ))}

    <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
      <button onClick={onPrev} className="btn-ghost">← Adresse</button>
      <button onClick={onNext} className="btn-primary">Continuer → Code parrain</button>
    </div>
  </div>
);

// Step 5: Code parrain
const StepCode = ({ referralCode, setReferralCode, referralInfo, setReferralInfo, total, onNext, onPrev }) => {
  const [input, setInput] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const applyCode = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setErr('');
    try {
      const { data } = await supabase.from('membres').select('code, username').eq('code', input.trim().toUpperCase()).maybeSingle();
      if (data) {
        setReferralCode(data.code);
        setReferralInfo({ owner: data.username, discount: 0.1 });
        setErr('');
      } else {
        setErr('Code invalide ou introuvable.');
      }
    } catch {
      setErr('Erreur de connexion. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const removeCode = () => {
    setReferralCode('');
    setReferralInfo(null);
    setInput('');
  };

  const discount = referralInfo ? Math.round(total * referralInfo.discount) : 0;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.18em', marginBottom: 8 }}>STEP 05 · CODE PARRAIN</div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em' }}>Tu as un code ?</h2>
        <p style={{ fontSize: 13, color: 'var(--mute)', marginTop: 6, lineHeight: 1.6 }}>
          −10% sur ta première commande. Optionnel — tu peux passer cette étape.
        </p>
      </div>

      {referralCode ? (
        <div style={{
          background: 'var(--panel)', border: '1px solid var(--teal)',
          padding: 22, marginBottom: 20,
        }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.18em', marginBottom: 8 }}>
            CODE APPLIQUÉ
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 40, fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.12em' }}>
              {referralCode}
            </span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--green)' }}>● VALIDÉ</span>
            <button onClick={removeCode} style={{
              marginLeft: 'auto', background: 'transparent', border: 'none',
              fontSize: 11, color: 'var(--mute)', textDecoration: 'underline', cursor: 'pointer',
            }}>Retirer</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
            <div>
              <div style={{ color: 'var(--mute)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Parrain</div>
              <div style={{ color: 'var(--teal)', fontFamily: 'Space Mono, monospace' }}>{referralInfo?.owner}</div>
            </div>
            <div>
              <div style={{ color: 'var(--mute)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Réduction</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700 }}>
                −10% · −{discount}€
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.18em', marginBottom: 8 }}>
            SAISIR UN CODE
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="px-input"
              value={input}
              onChange={e => setInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && applyCode()}
              placeholder="ex. NOVO44"
              style={{ flex: 1, fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em' }}
            />
            <button onClick={applyCode} className="btn-ghost" style={{ whiteSpace: 'nowrap' }} disabled={loading}>
              {loading ? '...' : 'APPLIQUER'}
            </button>
          </div>
          {err && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--red)' }}>{err}</div>}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={onPrev} className="btn-ghost">← Livraison</button>
        <button onClick={onNext} className="btn-primary">Continuer → Confirmation</button>
        {!referralCode && (
          <button onClick={onNext} style={{
            background: 'transparent', border: 'none',
            fontSize: 12, color: 'var(--mute)',
            textDecoration: 'underline', cursor: 'pointer',
          }}>Passer cette étape</button>
        )}
      </div>
    </div>
  );
};

// Step 6: Confirmation
const StepConfirm = ({ contact, adresse, shippingId, referralCode, referralInfo, items, total }) => {
  const shipping = SHIPPING.find(s => s.id === shippingId) || SHIPPING[1];
  const discount = referralInfo ? Math.round(total * referralInfo.discount) : 0;
  const grand = total + shipping.price - discount;
  const ref = `PX-${Date.now().toString().slice(-4)}`;

  return (
    <div>
      <div style={{
        display: 'inline-block', padding: '6px 12px',
        border: '1px solid var(--teal-dim)',
        background: 'rgba(0,228,208,0.06)',
        fontFamily: 'Space Mono, monospace', fontSize: 11,
        color: 'var(--teal)', letterSpacing: '0.18em', marginBottom: 14,
      }}>
        ● COMMANDE ENREGISTRÉE
      </div>
      <h2 style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: 'clamp(32px, 5vw, 56px)',
        fontWeight: 700, letterSpacing: '-0.025em',
        lineHeight: 1, marginBottom: 8,
      }}>
        Merci. Référence<br />
        <span style={{ color: 'var(--teal)' }}>#{ref}</span>.
      </h2>
      <p style={{ fontSize: 15, color: 'var(--mute)', lineHeight: 1.7, marginBottom: 28, maxWidth: 540 }}>
        On te contacte sur <strong style={{ color: 'var(--fg)' }}>Telegram dans les 2 prochaines heures</strong> pour valider et organiser le paiement.
      </p>

      {/* Telegram CTA */}
      <div style={{
        border: '2px solid var(--teal)',
        background: 'rgba(0,228,208,0.04)',
        padding: 24, marginBottom: 24,
      }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.2em', marginBottom: 10 }}>
          ✈ PAIEMENT — ÉTAPE SUIVANTE
        </div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          Continue sur Telegram
        </div>
        <p style={{ fontSize: 14, color: 'var(--mute)', lineHeight: 1.6, marginBottom: 18 }}>
          Le règlement <strong style={{ color: 'var(--fg)' }}>ne se fait pas sur le site</strong>.
          Mentionne ta référence #{ref} quand tu nous contactes.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="https://t.me/zzptx"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', fontSize: 13 }}
          >
            ✈ Ouvrir Telegram → @zzptx
          </a>
          <button
            onClick={() => navigator.clipboard?.writeText(`#${ref}`)}
            style={{
              padding: '12px 18px', border: '1px solid var(--teal-dim)',
              color: 'var(--teal)', fontFamily: 'Space Mono, monospace',
              fontSize: 12, letterSpacing: '0.14em', background: 'transparent', cursor: 'pointer',
            }}
          >
            Copier #{ref}
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--mute)', letterSpacing: '0.18em', marginBottom: 10 }}>SUIVI</div>
      {[
        ['●', 'Commande enregistrée', "à l'instant", 'var(--teal)'],
        ['◐', 'Contact Telegram', 'sous 2h', 'var(--fg)'],
        ['○', 'Paiement', 'après accord', 'var(--mute)'],
        ['○', 'Expédition', 'sous 24h après paiement', 'var(--mute)'],
      ].map(([dot, t, s, c], i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'baseline', gap: 12,
          padding: '10px 0', borderBottom: '1px solid var(--rule)',
        }}>
          <span style={{ color: c, fontFamily: 'Space Mono, monospace', fontSize: 12 }}>{dot}</span>
          <span style={{ flex: 1, color: c, fontSize: 13, fontWeight: i < 2 ? 600 : 400 }}>{t}</span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--mute)' }}>{s}</span>
        </div>
      ))}

      <div style={{ marginTop: 32 }}>
        <Link href="/" className="btn-ghost">← Retour au catalogue</Link>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  const { items, remove, update, clear, total } = useCart();
  const [step, setStep] = useState(0);

  const [contact, setContact] = useState({ prenom: '', nom: '', telegram: '', email: '' });
  const [adresse, setAdresse] = useState({ adresse: '', complement: '', cp: '', ville: '', pays: 'France' });
  const [shippingId, setShippingId] = useState('colissimo');
  const [referralCode, setReferralCode] = useState('');
  const [referralInfo, setReferralInfo] = useState(null);

  const selectedShipping = SHIPPING.find(s => s.id === shippingId) || SHIPPING[1];
  const discount = referralInfo ? Math.round(total * referralInfo.discount) : 0;

  const submitOrder = async () => {
    const orderId = `PX-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    const order = {
      id: orderId,
      prenom: contact.prenom,
      nom: contact.nom,
      telegram: contact.telegram,
      email: contact.email,
      adresse: adresse.adresse,
      complement: adresse.complement,
      ville: adresse.ville,
      cp: adresse.cp,
      pays: adresse.pays,
      items: items.map(i => `${i.count}×${i.name} ${i.dose}${i.qty > 1 ? ` (×${i.qty})` : ''}`).join(' · '),
      subtotal: total,
      shipping_method: selectedShipping.label,
      shipping_price: selectedShipping.price,
      referral_code: referralCode || null,
      discount,
      total: total + selectedShipping.price - discount,
      status: 'En attente',
    };

    try {
      await supabase.from('orders').insert([order]);
      if (referralCode) {
        await supabase.from('historique').insert([{
          type: 'parrainage',
          membre: referralCode,
          montant: order.total,
          credits: Math.round(order.total * 0.05),
          note: `Filleul: ${contact.telegram} · Commande ${orderId}`,
        }]);
      }
    } catch {
      // Continue to confirmation even if save fails
    }

    clear();
    setStep(5);
    if (typeof window !== 'undefined') sessionStorage.setItem('last_order_id', orderId);
  };

  const next = () => {
    if (step === 4) { submitOrder(); return; }
    setStep(s => s + 1);
  };
  const prev = () => setStep(s => s - 1);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '80vh' }}>
      <Stepper active={step} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: step === 5 ? '1.6fr 1fr' : '1.6fr 1fr',
        gap: 32,
        padding: '36px 28px',
        maxWidth: 1100,
        margin: '0 auto',
      }} className="checkout-grid">
        <div>
          {step === 0 && <StepArticles items={items} update={update} remove={remove} onNext={next} />}
          {step === 1 && <StepContact data={contact} setData={setContact} onNext={next} onPrev={prev} />}
          {step === 2 && <StepAdresse data={adresse} setData={setAdresse} onNext={next} onPrev={prev} />}
          {step === 3 && <StepLivraison selectedShipping={shippingId} setShipping={setShippingId} onNext={next} onPrev={prev} />}
          {step === 4 && (
            <StepCode
              referralCode={referralCode}
              setReferralCode={setReferralCode}
              referralInfo={referralInfo}
              setReferralInfo={setReferralInfo}
              total={total}
              onNext={next}
              onPrev={prev}
            />
          )}
          {step === 5 && (
            <StepConfirm
              contact={contact}
              adresse={adresse}
              shippingId={shippingId}
              referralCode={referralCode}
              referralInfo={referralInfo}
              items={items}
              total={total}
            />
          )}
        </div>

        {/* Recap panel — hidden on confirmation step (it has its own recap) */}
        {step < 5 && step > 0 && (
          <div className="desktop-only">
            <RecapPanel
              items={items}
              total={total}
              shippingPrice={step >= 3 ? selectedShipping.price : undefined}
              shippingLabel={step >= 3 ? selectedShipping.label : undefined}
              discount={step >= 4 ? discount : 0}
              discountLabel={referralCode ? `Code ${referralCode} (−10%)` : ''}
            />
          </div>
        )}
      </div>

    </div>
  );
}
