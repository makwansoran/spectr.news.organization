'use client';

import { useEffect, useRef } from 'react';

type VantaEffect = { destroy: () => void };

export function VantaTopologyBg() {
  const elRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffect | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let cancelled = false;
    const p5Url = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
    // Preload p5 so it’s requested immediately
    if (typeof document !== 'undefined' && !document.querySelector(`link[href="${p5Url}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = p5Url;
      link.as = 'script';
      document.head.appendChild(link);
    }

    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });

    const init = async () => {
      try {
        const [, vantaTopology] = await Promise.all([
          loadScript(p5Url),
          import('vanta/dist/vanta.topology.min'),
        ]);
        if (cancelled || !elRef.current) return;

        const win = window as unknown as { p5?: new (fn: (p: unknown) => void) => void };
        const p5 = win.p5;
        const TOPOLOGY = (vantaTopology as { default: (opts: Record<string, unknown>) => VantaEffect }).default;
        if (typeof TOPOLOGY !== 'function' || !p5) return;

        effectRef.current = TOPOLOGY({
          el,
          p5,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          speed: 7,
          backgroundColor: 0x222222,
          color: 0x2563eb,
        });
      } catch (err) {
        console.error('Vanta TOPOLOGY init error:', err);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (effectRef.current?.destroy) effectRef.current.destroy();
      effectRef.current = null;
    };
  }, []);

  return (
    <div
      ref={elRef}
      className="absolute inset-0 w-full h-full bg-[#222222]"
      style={{ backgroundColor: '#222222' }}
      aria-hidden
    />
  );
}
