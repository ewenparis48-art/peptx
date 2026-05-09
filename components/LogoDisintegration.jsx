'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function LogoDisintegration({ isDark }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const [phase, setPhase] = useState('idle'); // idle | animating | welcome
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const handleClick = () => {
    if (!isHome) { router.push('/'); return; }
    if (phase !== 'idle') return;
    runAnimation();
  };

  const runAnimation = () => {
    setPhase('animating');

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      // Scale canvas for retina — crisp pixels
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      const cx = W / 2;
      const cy = H / 2;

      // Scattered logo instances
      const logoCount = 22;
      const logos = [];
      for (let i = 0; i < logoCount; i++) {
        logos.push({
          x: (0.04 + Math.random() * 0.88) * W,
          y: (0.06 + Math.random() * 0.86) * H,
          size: 16 + Math.random() * 26,
          alpha: 0.2 + Math.random() * 0.8,
          rot: (Math.random() - 0.5) * 0.35,
        });
      }

      const drawLogos = () => {
        ctx.clearRect(0, 0, W, H);
        for (const lg of logos) {
          ctx.save();
          ctx.globalAlpha = lg.alpha;
          ctx.translate(lg.x, lg.y);
          ctx.rotate(lg.rot);
          ctx.font = `700 ${lg.size}px "Space Grotesk", "Inter", sans-serif`;
          const pw = ctx.measureText('Pept').width;
          ctx.fillStyle = isDark ? '#e8eef4' : '#0a0e12';
          ctx.fillText('Pept', 0, 0);
          ctx.fillStyle = isDark ? '#00e4d0' : '#0a8a82';
          ctx.fillText('X', pw, 0);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      };

      drawLogos();

      // Sample pixels at logical resolution
      const imgData = ctx.getImageData(0, 0, W * dpr, H * dpr);
      const data = imgData.data;
      const pw = W * dpr;

      const particles = [];
      const step = 3;
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          // Sample at DPR-scaled coordinates
          const sx = Math.round(x * dpr);
          const sy = Math.round(y * dpr);
          const idx = (sy * pw + sx) * 4;
          if (data[idx + 3] > 50) {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const spd = 4 + Math.random() * 12;
            // Random angle drift for organic feel
            const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
            particles.push({
              x, y,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd - Math.random() * 2,
              r: data[idx], g: data[idx + 1], b: data[idx + 2],
            });
          }
        }
      }

      // Hold phase (500ms)
      setTimeout(() => {
        let t0 = null;
        const dur = 1400;

        const dissolve = (ts) => {
          if (!t0) t0 = ts;
          const t = Math.min((ts - t0) / dur, 1);

          // Ease-out cubic: fast burst, graceful float
          const moveEase = 1 - Math.pow(1 - t, 3);
          // Alpha: hold longer, then dissolve fast at the end
          const alpha = Math.pow(1 - t, 1.4);

          ctx.clearRect(0, 0, W, H);
          for (const p of particles) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
            ctx.fillRect(
              p.x + p.vx * moveEase * 100,
              p.y + p.vy * moveEase * 100,
              step, step
            );
          }
          ctx.globalAlpha = 1;

          if (t < 1) {
            rafRef.current = requestAnimationFrame(dissolve);
          } else {
            ctx.clearRect(0, 0, W, H);
            setPhase('welcome');
            setTimeout(() => setPhase('idle'), 2800);
          }
        };

        rafRef.current = requestAnimationFrame(dissolve);
      }, 500);
    }, 30);
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <>
      {/* Header logo — always visible when not animating */}
      <div
        onClick={handleClick}
        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', userSelect: 'none' }}
      >
        <img
          src={isDark ? '/logo-dark.png' : '/logo-light.png'}
          alt="PeptX"
          style={{ height: 28, width: 'auto', display: 'block' }}
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'inline';
          }}
        />
        <span style={{
          display: 'none',
          fontFamily: 'Space Grotesk, Inter, sans-serif',
          fontWeight: 700, fontSize: 22,
          letterSpacing: '-0.02em',
        }}>
          Pept<span style={{ color: 'var(--teal)' }}>X</span>
        </span>
      </div>

      {/* Full-screen canvas for particle animation */}
      {phase === 'animating' && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed', inset: 0,
            width: '100vw', height: '100vh',
            zIndex: 300,
            background: isDark ? '#0a0e12' : '#f5f3ee',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Welcome message overlay */}
      {phase === 'welcome' && (
        <div
          onClick={() => setPhase('idle')}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: isDark ? '#0a0e12' : '#f5f3ee',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            animation: 'welcome-fade 0.5s ease forwards',
          }}
        >
          <div style={{ textAlign: 'center', padding: '0 24px' }}>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 'clamp(10px, 1.5vw, 14px)',
              color: 'var(--teal)',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              marginBottom: 28,
            }}>
              ◆ BIENVENUE ◆
            </div>
            <div style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              fontSize: 'clamp(52px, 11vw, 130px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 0.92,
              color: 'var(--fg)',
            }}>
              Bienvenue<br />
              chez{' '}
              <span style={{ color: 'var(--teal)' }}>PeptX</span>
            </div>
            <div style={{
              marginTop: 36,
              fontFamily: 'Space Mono, monospace',
              fontSize: 'clamp(10px, 1.2vw, 12px)',
              color: 'var(--mute)',
              letterSpacing: '0.18em',
            }}>
              CLIQUER POUR CONTINUER
            </div>
          </div>
        </div>
      )}
    </>
  );
}
