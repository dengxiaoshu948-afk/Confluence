import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: "blue" | "green";
}

interface Reaction {
  x: number;
  y: number;
  time: number;
  type: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const reactionsRef = useRef<Reaction[]>([]);
  const rafRef = useRef<number>(0);
  const isDarkRef = useRef(true);

  // Detect dark mode from html class
  useEffect(() => {
    const checkDark = () => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    // 40 blue + 30 green = 70 total (performance optimized)
    const createParticles = (count: number, color: "blue" | "green") =>
      Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.2,
        color,
      }));

    particlesRef.current = [
      ...createParticles(40, "blue"),
      ...createParticles(30, "green"),
    ];

    const reactions = reactionsRef.current;
    const particles = particlesRef.current;
    let time = 0;

    const animate = () => {
      time++;
      const dark = isDarkRef.current;

      // Clear with fade
      ctx.fillStyle = dark ? "rgba(5, 5, 7, 0.2)" : "rgba(248, 250, 252, 0.2)";
      ctx.fillRect(0, 0, W, H);

      const mouse = mouseRef.current;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        // Mouse attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 5) {
          const f = (1 - dist / 180) * 0.025;
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
        }

        p.vx *= 0.994;
        p.vy *= 0.994;

        // Draw
        const r = p.color === "blue" ? 100 : 80;
        const g = p.color === "blue" ? 180 : 220;
        const b = p.color === "blue" ? 255 : 140;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();
      }

      // Cross-color collisions (simplified)
      if (time % 2 === 0) {
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].color !== "blue") continue;
          for (let j = i + 1; j < particles.length; j++) {
            if (particles[j].color !== "green") continue;
            const cdx = particles[i].x - particles[j].x;
            const cdy = particles[i].y - particles[j].y;
            const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
            if (cdist < 12 && cdist > 0) {
              reactions.push({
                x: (particles[i].x + particles[j].x) / 2,
                y: (particles[i].y + particles[j].y) / 2,
                time,
                type: Math.floor(Math.random() * 3),
              });
              // Push apart
              const angle = Math.atan2(cdy, cdx);
              particles[i].vx += Math.cos(angle) * 1.5;
              particles[i].vy += Math.sin(angle) * 1.5;
              particles[j].vx -= Math.cos(angle) * 1.5;
              particles[j].vy -= Math.sin(angle) * 1.5;
            }
          }
        }
      }

      // Draw reactions
      for (let i = reactions.length - 1; i >= 0; i--) {
        const r = reactions[i];
        const age = time - r.time;
        if (age > 40) {
          reactions.splice(i, 1);
          continue;
        }
        const progress = age / 40;
        const alpha = (1 - progress) * 0.6;
        const size = progress * 30;

        if (r.type === 0) {
          // Ring
          ctx.strokeStyle = `rgba(120, 255, 200, ${alpha})`;
          ctx.lineWidth = 1.5 * (1 - progress);
          ctx.beginPath();
          ctx.arc(r.x, r.y, size, 0, Math.PI * 2);
          ctx.stroke();
        } else if (r.type === 1) {
          // Nova
          const gradient = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, size * 1.5);
          gradient.addColorStop(0, `rgba(200, 240, 255, ${alpha * 0.5})`);
          gradient.addColorStop(1, "rgba(200, 240, 255, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(r.x, r.y, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sparks
          for (let s = 0; s < 4; s++) {
            const angle = (s / 4) * Math.PI * 2 + progress * 3;
            const dist = progress * 25;
            ctx.beginPath();
            ctx.arc(r.x + Math.cos(angle) * dist, r.y + Math.sin(angle) * dist, 1.5 * (1 - progress), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
            ctx.fill();
          }
        }
      }

      // Same-color connections (limited)
      for (let i = 0; i < particles.length; i += 2) {
        for (let j = i + 2; j < particles.length; j += 2) {
          if (particles[i].color !== particles[j].color) continue;
          const ldx = particles[i].x - particles[j].x;
          const ldy = particles[i].y - particles[j].y;
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
          if (ldist < 140) {
            const c = particles[i].color === "blue" ? "100,180,255" : "80,220,140";
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${c}, ${(1 - ldist / 140) * 0.1})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
