'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function LogoDisintegration({ isDark }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const [animating, setAnimating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);

  const handleClick = () => {
    if (!isHome) {
      router.push('/');
      return;
    }
    if (animating || showWelcome) return;
    runDisintegration();
  };

  const runDisintegration = () => {
    setAnimating(true);
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.display = 'block';

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the logo text on canvas
    const logoText = 'PeptX';
    ctx.font = `700 28px "Space Grotesk", "Inter", sans-serif`;
    ctx.fillStyle = isDark ? '#e8eef4' : '#0a0e12';
    ctx.fillText(logoText, 0, 28);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Collect lit pixels to become particles
    const particles = [];
    const step = 3;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const idx = (y * canvas.width + x) * 4;
        const a = pixels[idx + 3];
        if (a > 80) {
          const r = pixels[idx], g = pixels[idx + 1], b = pixels[idx + 2];
          particles.push({
            x, y,
            r, g, b,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 1.2) * 8,
            alpha: 1,
            size: step,
          });
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let start = null;
    const duration = 900;

    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.alpha = 1 - progress;
        p.x += p.vx * 0.06;
        p.y += p.vy * 0.06;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        setAnimating(false);
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 2800);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{ position: 'relative', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
    >
      {/* Actual logo image */}
      {!animating && !showWelcome && (
        <img
          src={isDark ? '/logo-dark.png' : '/logo-light.png'}
          alt="PeptX"
          style={{ height: 28, width: 'auto', display: 'block' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
      )}

      {/* Fallback text logo */}
      {!animating && !showWelcome && (
        <span style={{
          display: 'none',
          fontFamily: 'Space Grotesk, Inter, sans-serif',
          fontWeight: 700, fontSize: 22,
          color: isDark ? 'var(--fg)' : 'var(--fg)',
          letterSpacing: '-0.02em',
        }}>
          Pept<span style={{ color: 'var(--teal)' }}>X</span>
        </span>
      )}

      {/* Welcome message */}
      {showWelcome && (
        <div className="animate-welcome" style={{
          fontFamily: 'Space Grotesk, Inter, sans-serif',
          fontWeight: 700, fontSize: 18,
          color: 'var(--teal)',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}>
          Bienvenue chez PeptX ✦
        </div>
      )}

      {/* Canvas overlay for animation */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          display: 'none', pointerEvents: 'none',
        }}
      />
    </div>
  );
}
