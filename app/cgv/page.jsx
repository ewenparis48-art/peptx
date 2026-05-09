export const metadata = {
  title: 'Conditions Générales de Vente — PeptX',
};

export default function CGVPage() {
  const sections = [
    {
      title: '1. Objet',
      content: `Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre PeptX (ci-après "le Vendeur") et tout client (ci-après "l'Acheteur") passant commande via le site peptx.vercel.app. Toute commande implique l'acceptation sans réserve des présentes CGV.`,
    },
    {
      title: '2. Produits',
      content: `Les produits proposés par PeptX sont des peptides de recherche à usage exclusivement scientifique. Ils ne sont pas destinés à la consommation humaine ou animale. Toute utilisation en dehors du cadre de la recherche est sous la seule responsabilité de l'acheteur.`,
    },
    {
      title: '3. Commande',
      content: `La commande est effectuée via le formulaire en ligne. Elle est considérée comme validée uniquement après confirmation explicite par le Vendeur via Telegram. Aucun engagement contractuel n'est formé avant cette confirmation.`,
    },
    {
      title: '4. Prix',
      content: `Les prix affichés sur le site sont exprimés en euros (€) toutes taxes comprises. PeptX se réserve le droit de modifier ses prix à tout moment. Les prix applicables sont ceux en vigueur au moment de la validation de la commande.`,
    },
    {
      title: '5. Paiement',
      content: `Le paiement ne s'effectue pas sur ce site. Après confirmation de la commande, le règlement est organisé en privé via Telegram (@zzptx). Les modes de paiement acceptés sont communiqués lors de l'échange Telegram. Aucune information bancaire n'est collectée sur ce site.`,
    },
    {
      title: '6. Livraison',
      content: `La livraison est effectuée en France métropolitaine. Les délais indicatifs sont : Mondial Relay (4–5j ouvrés), Colissimo (48h), Chronopost (24h), Main propre sur rendez-vous (Paris). Les frais de livraison sont indiqués lors du processus de commande. PeptX décline toute responsabilité pour les retards imputables au transporteur.`,
    },
    {
      title: '7. Rétractation',
      content: `Conformément à la nature des produits (peptides lyophilisés), aucun droit de rétractation ne peut être exercé une fois la commande expédiée. En cas de produit défectueux ou d'erreur d'expédition, l'Acheteur doit contacter le Vendeur dans les 48h suivant la réception.`,
    },
    {
      title: '8. Programme de parrainage',
      content: `PeptX propose un programme de parrainage donnant droit à une réduction de 10% sur la première commande de l'Acheteur parrainé. Les codes de parrainage sont strictement personnels et non cessibles. PeptX se réserve le droit de suspendre ce programme à tout moment.`,
    },
    {
      title: '9. Données personnelles',
      content: `Les données collectées (nom, prénom, adresse, Telegram) sont utilisées exclusivement pour le traitement de la commande et ne sont pas transmises à des tiers. Conformément au RGPD, l'Acheteur dispose d'un droit d'accès, de rectification et de suppression de ses données. Demande à adresser via Telegram : @zzptx.`,
    },
    {
      title: '10. Limitation de responsabilité',
      content: `PeptX ne peut être tenu responsable de tout dommage direct ou indirect résultant de l'utilisation des produits. Les produits sont vendus à des fins de recherche uniquement. Le Vendeur ne fournit aucun conseil médical.`,
    },
    {
      title: '11. Droit applicable',
      content: `Les présentes CGV sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront compétents.`,
    },
    {
      title: '12. Contact',
      content: `Pour toute question relative à ces CGV ou à une commande, contacter PeptX via Telegram : @zzptx.`,
    },
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '80vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 28px 60px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 10, color: 'var(--teal)',
            letterSpacing: '0.22em', marginBottom: 14,
          }}>
            ◆ DOCUMENT LÉGAL · MISE À JOUR 01.01.2026
          </div>
          <h1 style={{
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700, letterSpacing: '-0.02em',
            lineHeight: 1, marginBottom: 16,
          }}>
            Conditions Générales<br />
            <span style={{ color: 'var(--teal)' }}>de Vente</span>
          </h1>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11, color: 'var(--mute)',
            letterSpacing: '0.12em', lineHeight: 1.6,
          }}>
            PeptX · peptx.vercel.app<br />
            Contact : <a href="https://t.me/zzptx" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)', textDecoration: 'none' }}>@zzptx</a>
          </div>
        </div>

        {/* Sections */}
        {sections.map((s, i) => (
          <div key={i} style={{
            marginBottom: 32,
            paddingBottom: 32,
            borderBottom: i < sections.length - 1 ? '1px solid var(--rule)' : 'none',
          }}>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 18, fontWeight: 600,
              marginBottom: 12, color: 'var(--fg)',
            }}>
              {s.title}
            </h2>
            <p style={{
              fontSize: 14, color: 'var(--mute)',
              lineHeight: 1.8,
            }}>
              {s.content}
            </p>
          </div>
        ))}

        {/* Footer note */}
        <div style={{
          marginTop: 40,
          padding: '20px 24px',
          background: 'var(--panel)',
          border: '1px solid var(--rule)',
          fontFamily: 'Space Mono, monospace',
          fontSize: 10, color: 'var(--faint)',
          letterSpacing: '0.12em', lineHeight: 1.7,
        }}>
          Document non contractuel avant confirmation de commande via Telegram.<br />
          © 2026 PeptX · Tous droits réservés
        </div>
      </div>
    </div>
  );
}
