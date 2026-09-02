import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
  color: string;
  star: boolean;
};

const COLORS = [
  "rgba(120, 220, 255,",
  "rgba(150, 200, 255,",
  "rgba(110, 165, 255,",
  "rgba(255, 170, 215,",
  "rgba(255, 205, 175,",
];

export default function AniimoCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.documentElement.classList.add("aniimo-cursor-active");

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = width / 2;
    let my = height / 2;
    let px = mx;
    let py = my;
    let rx = mx;
    let ry = my;
    let hovering = false;
    let visible = false;
    const particles: Particle[] = [];
    const MAX = 90;

    const isInteractive = (el: Element | null) =>
      !!el?.closest("a, button, [role='button'], input, select, textarea, label, summary");

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      visible = true;
      hovering = isInteractive(e.target as Element);

      if (reduced) return;
      const dx = mx - px;
      const dy = my - py;
      const speed = Math.hypot(dx, dy);
      px = mx;
      py = my;
      if (speed < 1.2) return;
      const count = Math.min(5, Math.max(2, Math.round(speed / 14)));
      for (let i = 0; i < count && particles.length < MAX; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spread = 0.3 + Math.random() * 0.9;
        particles.push({
          x: mx + (Math.random() - 0.5) * 8,
          y: my + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * spread - dx * 0.02,
          vy: Math.sin(angle) * spread - dy * 0.02,
          life: 0,
          ttl: 400 + Math.random() * 300,
          size: 0.8 + Math.random() * 1.8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)] as string,
          star: Math.random() < 0.15,
        });
      }
    };

    const onLeave = () => {
      visible = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    let last = performance.now();
    let raf = 0;

    const drawStar = (p: Particle, alpha: number, scale: number) => {
      const r = p.size * 3 * scale;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - r);
      ctx.quadraticCurveTo(p.x, p.y, p.x + r, p.y);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + r);
      ctx.quadraticCurveTo(p.x, p.y, p.x - r, p.y);
      ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - r);
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.fill();
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      ctx.clearRect(0, 0, width, height);

      if (!reduced) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          if (!p) continue;
          p.life += dt;
          if (p.life >= p.ttl) {
            particles.splice(i, 1);
            continue;
          }
          const t = p.life / p.ttl;
          const alpha = (1 - t) * 0.7;
          const scale = 1 - t * 0.6;
          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16) - dt * 0.004;
          p.vx *= 0.97;
          p.vy *= 0.97;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `${p.color}${alpha * 0.8})`;
          if (p.star) {
            drawStar(p, alpha, scale);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * scale, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${alpha})`;
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // cursor
      if (visible) {
        const ease = reduced ? 1 : 0.18;
        rx += (mx - rx) * ease;
        ry += (my - ry) * ease;

        const ringR = (hovering ? 19 : 14) * 1;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.shadowBlur = hovering ? 18 : 12;
        ctx.shadowColor = `rgba(130, 220, 255, ${hovering ? 0.9 : 0.6})`;
        ctx.strokeStyle = `rgba(150, 225, 255, ${hovering ? 0.95 : 0.7})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(rx, ry, ringR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 175, 215, ${hovering ? 0.5 : 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rx, ry, ringR + 2.5, Math.PI * 0.15, Math.PI * 0.85);
        ctx.stroke();

        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 6);
        grad.addColorStop(0, "rgba(235, 250, 255, 0.95)");
        grad.addColorStop(0.6, "rgba(140, 215, 255, 0.85)");
        grad.addColorStop(1, "rgba(255, 175, 215, 0.15)");
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(130, 220, 255, 0.8)";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("aniimo-cursor-active");
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
