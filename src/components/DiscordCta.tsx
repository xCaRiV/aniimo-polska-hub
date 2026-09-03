import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  star: boolean;
};

const COLORS = [
  "rgba(140, 225, 255,", // cyan
  "rgba(160, 200, 255,", // light blue
  "rgba(120, 165, 255,", // blue
  "rgba(255, 175, 220,", // pink
  "rgba(255, 205, 175,", // peach
];

/** Accurate Discord "Clyde" mark (official simple-icons path). */
export function DiscordGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      shapeRendering="geometricPrecision"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

export function DiscordCta({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const particles: Particle[] = [];
    const PAD = 18;

    const spawn = () => {
      const bw = Math.max(0, w - PAD * 2);
      const bh = Math.max(0, h - PAD * 2);
      const perim = 2 * (bw + bh);
      let t = Math.random() * perim;
      let x: number;
      let y: number;
      if (t < bw) {
        x = PAD + t;
        y = PAD;
      } else if ((t -= bw) < bh) {
        x = PAD + bw;
        y = PAD + t;
      } else if ((t -= bh) < bw) {
        x = PAD + bw - t;
        y = PAD + bh;
      } else {
        x = PAD;
        y = PAD + bh - (t - bw);
      }
      const outX = x < w / 2 ? -1 : 1;
      const outY = y < h / 2 ? -1 : 1;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)] as string;
      const maxLife = 700 + Math.random() * 700;
      particles.push({
        x,
        y,
        vx: outX * (0.04 + Math.random() * 0.09) * (Math.random() < 0.4 ? 0.3 : 1),
        vy: outY * (0.05 + Math.random() * 0.1),
        life: 0,
        maxLife,
        size: 0.7 + Math.random() * 1.5,
        color,
        star: Math.random() < 0.18,
      });
    };

    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const drawStar = (p: Particle, alpha: number) => {
      const s = p.size * 3.2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - s);
      ctx.quadraticCurveTo(p.x, p.y, p.x + s, p.y);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s);
      ctx.quadraticCurveTo(p.x, p.y, p.x - s, p.y);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s);
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.fill();
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;

      // Low, irregular spawn rate — with natural quiet moments.
      const rate = hoverRef.current ? 0.011 : 0.0035;
      acc += dt * rate;
      while (acc >= 1) {
        acc -= 1;
        if (particles.length < 40 && Math.random() < 0.75) spawn();
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const k = p.life / p.maxLife;
        const alpha = Math.sin(Math.PI * k) * 0.75;
        if (p.star) {
          drawStar(p, alpha);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${alpha})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${alpha * 0.16})`;
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex w-full sm:w-auto"
      onMouseEnter={() => {
        hoverRef.current = true;
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />
      <a href={href} target="_blank" rel="noreferrer" className={`discord-cta ${className}`}>
        <span className="discord-cta-shimmer" aria-hidden="true" />
        <span className="relative z-10 flex items-center justify-center gap-2.5">{children}</span>
      </a>
    </span>
  );
}
