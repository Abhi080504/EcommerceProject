// src/components/FluidBackground.tsx
import React, { JSX, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "fluidDisabled";

declare global {
  interface Window {
    createFluidSim?: (opts: { canvas: HTMLCanvasElement; config?: any }) => any;
  }
}

export default function FluidBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<any>(null);
  const [disabled, setDisabled] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "true"; } catch { return false; }
  });

  useEffect(() => {
    if (typeof window === "undefined" || disabled) return;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    if (window.innerWidth < 600) return; // keep small-screen off

    const libSrc = "/libs/webgl-fluid.js";
    let script: HTMLScriptElement | null = null;
    const w = window as any;
    const libLoaded = !!w.createFluidSim;

    const init = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // config (not used by stub but kept for future)
      const config = { SIM_RESOLUTION: 128 };

      // create sim and store
      try {
        const sim = w.createFluidSim({ canvas, config });
        simRef.current = sim;
      } catch (e) {
        console.warn("fluid init failed:", e);
      }

      // pointer handlers: compute normalized coords and call splat
      let last = 0;
      const handlePointer = (clientX: number, clientY: number) => {
        const now = performance.now();
        // throttle a bit to reduce spam
        if (now - last < 16) return;
        last = now;
        const rect = canvas.getBoundingClientRect();
        const nx = (clientX - rect.left) / rect.width;
        const ny = (clientY - rect.top) / rect.height;
        // pick a color based on position (simple)
        const r = Math.floor(120 + 120 * nx);
        const g = Math.floor(80 + 120 * ny);
        const b = 200 - Math.floor(100 * nx * ny);
        const radiusPx = Math.max(20, Math.min(rect.width, rect.height) * 0.08);
        try { simRef.current?.splat(nx, ny, radiusPx, { r, g, b }); } catch (e) { /* ignore */ }
      };

      // mouse move
      const onMouseMove = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
      // touch
      const onTouchMove = (e: TouchEvent) => {
        for (let i = 0; i < e.touches.length; i++) {
          handlePointer(e.touches[i].clientX, e.touches[i].clientY);
        }
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });

      // store cleanup handler on simRef for later removal
      (simRef as any).cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
      };
    };

    if (!libLoaded) {
      script = document.createElement("script");
      script.src = libSrc;
      script.defer = true;
      script.onload = () => init();
      script.onerror = () => console.warn("failed to load fluid lib:", libSrc);
      document.body.appendChild(script);
    } else {
      init();
    }

    return () => {
      // cleanup script if we added it
      if (script) script.remove();
      // cleanup sim listeners & destroy instance
      try {
        (simRef as any).cleanup?.();
        simRef.current?.destroy?.();
      } catch {}
    };
  }, [disabled]);

  const toggle = () => {
    const next = !disabled;
    setDisabled(next);
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
  };

  return (
    <>
      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-[60] rounded-md px-3 py-1 text-sm bg-white/90 text-gray-800 shadow-md"
        aria-pressed={disabled}
      >
        {disabled ? "Enable Background" : "Disable Background"}
      </button>

      <canvas
        ref={canvasRef}
        id="fluid"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 w-screen h-screen z-0 opacity-90"
      />
    </>
  );
}
