import { useEffect, useRef } from "react";
import { reducedMotion } from "../lib/world";

export default function Particles({ active = false, burst = false }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = innerWidth,
      height = innerHeight,
      raf,
      last = 0;
    const quiet = reducedMotion();
    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const motes = Array.from({ length: width < 650 ? 36 : 72 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      speed: Math.random() * 0.2 + 0.07,
      phase: Math.random() * 6.28,
    }));
    let sparks = [];
    const move = (e) => {
      if ((active || e.target.closest?.(".portrait.filled")) && !quiet)
        for (let i = 0; i < 3; i++)
          sparks.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 1.5,
            life: 1,
          });
      sparks = sparks.slice(-110);
    };
    const draw = (time) => {
      const delta = Math.min((time - last) / 16.67 || 1, 3);
      last = time;
      ctx.clearRect(0, 0, width, height);
      for (const p of motes) {
        if (!quiet) {
          p.y -= p.speed * delta * (burst ? 5 : 1);
          p.x += Math.sin(time / 3500 + p.phase) * 0.1 * delta;
        }
        if (p.y < -5) p.y = height + 5;
        const opacity = 0.18 + (Math.sin(time / 1600 + p.phase) + 1) * 0.22;
        ctx.beginPath();
        ctx.fillStyle = `rgba(231,199,135,${opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#e1b866";
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const s of sparks) {
        s.x += s.vx * delta;
        s.y += s.vy * delta;
        s.life -= 0.022 * delta;
        ctx.fillStyle = `rgba(255,222,159,${Math.max(0, s.life)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0, s.life) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      sparks = sparks.filter((s) => s.life > 0);
      if (!quiet) raf = requestAnimationFrame(draw);
    };
    const visibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [active, burst]);
  return <canvas className="particles" ref={canvasRef} aria-hidden="true" />;
}
