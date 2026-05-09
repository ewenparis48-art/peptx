export const products = [
  { sku: 'RTA10', name: 'Rétatrutide',   dose: '10mg',   purity: 99.4, price1: 50,  price5: 270, price10: 400, lot: 'PX-2604' },
  { sku: 'RTA20', name: 'Rétatrutide',   dose: '20mg',   purity: 99.6, price1: 90,  price5: 370, price10: 500, lot: 'PX-2605' },
  { sku: 'GHK50', name: 'GHK-CU',        dose: '50mg',   purity: 99.8, price1: 30,  price5: 90,  price10: 200, lot: 'PX-2606' },
  { sku: 'GHK10', name: 'GHK-CU',        dose: '100mg',  purity: 99.7, price1: 50,  price5: 150, price10: 300, lot: 'PX-2607' },
  { sku: 'CJC55', name: 'CJC1295/IPA',   dose: '5/5mg',  purity: 99.2, price1: 70,  price5: 200, price10: 400, lot: 'PX-2608' },
  { sku: 'TRZ30', name: 'Tirzepatide',   dose: '30mg',   purity: 99.5, price1: 70,  price5: 300, price10: 410, lot: 'PX-2609' },
  { sku: 'BPC10', name: 'BPC-157',       dose: '10mg',   purity: 99.3, price1: 40,  price5: 200, price10: 400, lot: 'PX-2610' },
  { sku: 'HGH36', name: 'HGH',           dose: '36iu',   purity: 99.1, price1: 60,  price5: 260, price10: 430, lot: 'PX-2611' },
];

export const getProduct = (sku) => products.find(p => p.sku === sku);

export const REFERRAL_CODES = {
  'NOVO44': { owner: '@novo_44', discount: 0.10 },
  'PEPTX10': { owner: '@peptx_ref', discount: 0.10 },
};

export const validateReferralCode = (code) => {
  return REFERRAL_CODES[code.toUpperCase()] || null;
};
