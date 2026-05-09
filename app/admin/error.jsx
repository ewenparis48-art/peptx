'use client';

export default function AdminError({ error, reset }) {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      <div style={{ maxWidth: 600, width: '100%' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--red)', letterSpacing: '0.18em', marginBottom: 12 }}>
          ◆ ERREUR CLIENT
        </div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 16, color: 'var(--fg)' }}>
          {error?.message || 'Erreur inconnue'}
        </h2>
        <pre style={{
          background: 'var(--panel)', border: '1px solid var(--rule)',
          padding: 16, fontSize: 11, color: 'var(--mute)',
          overflowX: 'auto', whiteSpace: 'pre-wrap', marginBottom: 20,
          fontFamily: 'Space Mono, monospace', lineHeight: 1.6,
        }}>
          {error?.stack}
        </pre>
        <button onClick={reset} style={{
          background: 'var(--teal)', color: '#000', border: 'none',
          padding: '12px 24px', fontFamily: 'Space Mono, monospace',
          fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer',
        }}>
          RÉESSAYER
        </button>
      </div>
    </div>
  );
}
