export const products = [
  // ── Peptides ────────────────────────────────────────────────────────────────
  { sku: 'RTA10', name: 'Rétatrutide',        dose: '10mg',  purity: 99.4, price1: 50,  price5: 270, price10: 400,  lot: 'PX-2604' },
  { sku: 'RTA20', name: 'Rétatrutide',        dose: '20mg',  purity: 99.6, price1: 90,  price5: 370, price10: 500,  lot: 'PX-2605' },
  { sku: 'RTA60', name: 'Rétatrutide',        dose: '60mg',  purity: 99.3, price1: 200, price5: 620, price10: 1200, lot: 'PX-2612' },
  { sku: 'GHK50', name: 'GHK-CU',            dose: '50mg',  purity: 99.8, price1: 30,  price5: 90,  price10: 200,  lot: 'PX-2606' },
  { sku: 'GHK10', name: 'GHK-CU',            dose: '100mg', purity: 99.7, price1: 50,  price5: 150, price10: 300,  lot: 'PX-2607' },
  { sku: 'MLT1',  name: 'Mélanotan 1',        dose: '10mg',  purity: 99.4, price1: 50,  price5: 150, price10: 300,  lot: 'PX-2613' },
  { sku: 'MLT2',  name: 'Mélanotan 2',        dose: '10mg',  purity: 99.5, price1: 50,  price5: 150, price10: 300,  lot: 'PX-2614' },
  { sku: 'CJC55', name: 'CJC1295/IPA',        dose: '5/5mg', purity: 99.2, price1: 70,  price5: 200, price10: 400,  lot: 'PX-2608' },
  { sku: 'IPA10', name: 'Ipamorelin',         dose: '10mg',  purity: 99.2, price1: 60,  price5: 170, price10: 300,  lot: 'PX-2615' },
  { sku: 'TRZ30', name: 'Tirzepatide',        dose: '30mg',  purity: 99.5, price1: 70,  price5: 300, price10: 410,  lot: 'PX-2609' },
  { sku: 'TRZ60', name: 'Tirzepatide',        dose: '60mg',  purity: 99.5, price1: 120, price5: 480, price10: 700,  lot: 'PX-2616' },
  { sku: 'BPC10', name: 'BPC-157',            dose: '10mg',  purity: 99.3, price1: 40,  price5: 200, price10: 400,  lot: 'PX-2610' },
  { sku: 'HGH36', name: 'HGH',               dose: '36iu',  purity: 99.1, price1: 60,  price5: 260, price10: 430,  lot: 'PX-2611' },
  { sku: 'TB500', name: 'TB-500',             dose: '10mg',  purity: 99.6, price1: 70,  price5: 200, price10: 400,  lot: 'PX-2617' },

  // ── Accessoires ─────────────────────────────────────────────────────────────
  { sku: 'EAU10', name: 'Eau bactériostatique', dose: '10ML', category: 'accessoire', price1: 10, price5: 40,  price10: 80,  lot: 'ACC-01' },
  { sku: 'SER10', name: 'Seringues 31G 6mm',    dose: '×10 — 1ML', category: 'accessoire', price1: 8,  price5: null, price10: null, lot: 'ACC-02' },
  { sku: 'SER20', name: 'Seringues 31G 6mm',    dose: '×20 — 1ML', category: 'accessoire', price1: 15, price5: null, price10: null, lot: 'ACC-02' },
  { sku: 'SER50', name: 'Seringues 31G 6mm',    dose: '×50 — 1ML', category: 'accessoire', price1: 25, price5: null, price10: null, lot: 'ACC-02' },
  { sku: 'SR100', name: 'Seringues 31G 6mm',    dose: '×100 — 1ML', category: 'accessoire', price1: 40, price5: null, price10: null, lot: 'ACC-02' },
];

export const getProduct = (sku) => products.find(p => p.sku === sku);

export const REFERRAL_CODES = {
  'NOVO44': { owner: '@novo_44', discount: 0.10 },
  'PEPTX10': { owner: '@peptx_ref', discount: 0.10 },
};

export const validateReferralCode = (code) => {
  return REFERRAL_CODES[code.toUpperCase()] || null;
};
