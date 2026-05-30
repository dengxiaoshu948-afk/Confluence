import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/providers/theme";

interface TextParticle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  targetX: number;
  targetY: number;
  phase: "text" | "dissolve" | "float" | "gather" | "formed";
  color: string;
  delay: number;
}

// Target pattern: abstract neural network / constellation
function generateTargetPattern(width: number, height: number, count: number) {
  const nodes: { x: number; y: number }[] = [];
  const cx = width / 2;
  const cy = height / 2 + 20;

  // Central node
  nodes.push({ x: cx, y: cy });

  // Orbiting rings - like an atom or neural network
  const rings = [80, 140, 200];
  const counts = [6, 10, 14];

  rings.forEach((radius, ri) => {
    const n = counts[ri];
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 + ri * 0.3;
      nodes.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius * 0.6,
      });
    }
  });

  // Fill remaining particles along connections
  const result: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const nodeIdx = i % nodes.length;
    const nextIdx = (nodeIdx + 1) % nodes.length;
    const t = Math.random();
    result.push({
      x: nodes[nodeIdx].x + (nodes[nextIdx].x - nodes[nodeIdx].x) * t + (Math.random() - 0.5) * 20,
      y: nodes[nodeIdx].y + (nodes[nextIdx].y - nodes[nodeIdx].y) * t + (Math.random() - 0.5) * 20,
    });
  }
  return result;
}

export function HeroCanvas({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();
  const [phase, setPhase] = useState<"typing" | "glow" | "dissolve" | "complete">("typing");
  const particlesRef = useRef<TextParticle[]>([]);
  const rafRef = useRef<number>(0);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const isDarkRef = useRef(isDark);

  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    // Phase timing
    const TIMING = {
      textAppear: 2000,
      hold: 1500,
      dissolve: 2500,
      float: 1000,
      gather: 2500,
    };

    let startTime = Date.now();

    // Create offscreen canvas to sample text pixels
    const offscreen = document.createElement("canvas");
    offscreen.width = W;
    offscreen.height = H;
    const offCtx = offscreen.getContext("2d")!;

    // Draw main title
    const fontSize = Math.min(W * 0.14, 100);
    offCtx.font = `bold ${fontSize}px Inter, sans-serif`;
    offCtx.fillStyle = "#fff";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText("Confluence", W / 2, H / 2 - 15);

    // Draw subtitle
    const subFontSize = Math.min(W * 0.04, 20);
    offCtx.font = `300 italic ${subFontSize}px Inter, sans-serif`;
    offCtx.fillText("在这里，每一个想法都值得被分享", W / 2, H / 2 + fontSize * 0.55);

    // Sample pixels
    const imageData = offCtx.getImageData(0, 0, W, H);
    const pixels = imageData.data;
    const particles: TextParticle[] = [];
    const step = 3; // Sample every 3rd pixel for performance

    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const i = (y * W + x) * 4;
        if (pixels[i + 3] > 128) {
          const isSubtitle = y > H / 2 + fontSize * 0.3;
          particles.push({
            originX: x,
            originY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.5 + 0.5,
            alpha: 0,
            targetX: 0,
            targetY: 0,
            phase: "text",
            color: isSubtitle ? "120,200,255" : "160,220,255",
            delay: Math.random() * 500,
          });
        }
      }
    }

    // Generate target pattern
    const targets = generateTargetPattern(W, H, particles.length);
    particles.forEach((p, i) => {
      p.targetX = targets[i % targets.length].x;
      p.targetY = targets[i % targets.length].y;
    });

    particlesRef.current = particles;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, W, H);

      const particles = particlesRef.current;

      // Phase: Text appear
      if (elapsed < TIMING.textAppear) {
        particles.forEach((p) => {
          if (elapsed > p.delay) {
            const localProgress = Math.min(1, (elapsed - p.delay) / (TIMING.textAppear * 0.7));
            p.alpha = localProgress;
          }
        });
        if (phase !== "typing") setPhase("typing");
      }
      // Phase: Hold (glowing)
      else if (elapsed < TIMING.textAppear + TIMING.hold) {
        particles.forEach((p) => {
          p.alpha = 1;
        });
        if (phase !== "glow") setPhase("glow");
      }
      // Phase: Dissolve
      else if (elapsed < TIMING.textAppear + TIMING.hold + TIMING.dissolve) {
        const dissolveProgress = (elapsed - TIMING.textAppear - TIMING.hold) / TIMING.dissolve;
        particles.forEach((p) => {
          p.phase = "dissolve";
          p.alpha = 1 - dissolveProgress * 0.5;
          // Scatter outward
          const angle = Math.atan2(p.y - H / 2, p.x - W / 2);
          const force = dissolveProgress * 50;
          p.x = p.originX + Math.cos(angle) * force + Math.sin(elapsed * 0.001 + p.originX) * 10;
          p.y = p.originY + Math.sin(angle) * force + Math.cos(elapsed * 0.001 + p.originY) * 10;
        });
        if (phase !== "dissolve") {
          setPhase("dissolve");
          // Fade out subtitle DOM element
          if (subtitleRef.current) {
            subtitleRef.current.style.transition = "opacity 1s ease";
            subtitleRef.current.style.opacity = "0";
          }
        }
      }
      // Phase: Float then gather
      else {
        const gatherElapsed = elapsed - TIMING.textAppear - TIMING.hold - TIMING.dissolve;
        const isGathering = gatherElapsed > TIMING.float;
        const gatherProgress = isGathering
          ? Math.min(1, (gatherElapsed - TIMING.float) / TIMING.gather)
          : 0;

        particles.forEach((p) => {
          if (isGathering) {
            p.phase = "gather";
            // Lerp toward target
            p.x += (p.targetX - p.x) * 0.04;
            p.y += (p.targetY - p.y) * 0.04;
            // Add floating noise
            p.x += Math.sin(elapsed * 0.002 + p.originX) * 0.5;
            p.y += Math.cos(elapsed * 0.002 + p.originY) * 0.5;
            p.alpha = 0.5 + gatherProgress * 0.5;
          } else {
            p.phase = "float";
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.alpha = 0.5;
          }
        });

        if (isGathering && gatherProgress > 0.8 && phase !== "complete") {
          setPhase("complete");
          onComplete?.();
        }
      }

      // Draw particles
      particles.forEach((p) => {
        if (p.alpha <= 0) return;

        // Glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        glow.addColorStop(0, `rgba(${p.color}, ${p.alpha * 0.3})`);
        glow.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections between nearby particles (neural network feel)
      if (phase === "complete" || phase === "dissolve") {
        for (let i = 0; i < particles.length; i += 5) {
          for (let j = i + 5; j < particles.length; j += 5) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(120, 200, 255, ${(1 - dist / 100) * 0.15})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isDark]);

  return (
    <div className="relative w-full h-[280px] md:h-[320px]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Subtitle text that fades out */}
      <div
        ref={subtitleRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none"
      >
        <p className="text-lg md:text-xl text-slate-500 dark:text-gray-400 font-light italic">
          在这里，每一个想法都值得被分享
        </p>
        <p className="text-sm tracking-[0.3em] uppercase text-blue-400/60 dark:text-blue-400/40 mt-2 font-medium">
          探索 · 创造 · 连接
        </p>
      </div>
    </div>
  );
}
