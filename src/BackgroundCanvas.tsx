import {useEffect, useRef} from 'react';

/** Full-bleed topographic canvas, repainted only when its size changes. */
export function BackgroundCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const texture = new Image();
    let disposed = false;
    const draw = () => {
      if (disposed) return;
      const w = innerWidth, h = innerHeight, dpr = Math.min(devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#181c1c';
      ctx.fillRect(0, 0, w, h);
      if (texture.complete && texture.naturalWidth) {
        const scale = Math.max(w / texture.naturalWidth, h / texture.naturalHeight);
        const tw = texture.naturalWidth * scale, th = texture.naturalHeight * scale;
        ctx.globalAlpha = .26;
        ctx.drawImage(texture, (w - tw) / 2, (h - th) / 2, tw, th);
        ctx.globalAlpha = 1;
      }
      const shade = ctx.createRadialGradient(w * .5, h * .38, 0, w * .5, h * .38, Math.max(w,h) * .7);
      shade.addColorStop(0, '#151a1900');
      shade.addColorStop(1, '#090e0d88');
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, w, h);
    };
    texture.onload = draw;
    texture.src = import.meta.env.BASE_URL + 'decor/topographic.svg';
    draw();
    window.addEventListener('resize', draw);
    return () => { disposed = true; texture.onload = null; window.removeEventListener('resize', draw); };
  }, []);
  return <canvas id="world" ref={ref} aria-hidden="true"/>;
}
