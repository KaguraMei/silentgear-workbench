import {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import E, {type Build} from './engine.js';
import {composeGear, makeGear, disposeMesh} from './gear-model';
type Viewer = {setSprite(sprite: HTMLCanvasElement): void; clear(): void; reset(): void; zoom(amount: number): void; spin(value: boolean): void};

export function GearArt({build}: {build: Build}) {
  const holder = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const [fallback, setFallback] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => { setReducedMotion(media.matches); if (media.matches) setAutoRotate(false); };
    media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  }, []);

  useEffect(() => {
    if (fallback) return;
    const canvas = canvasRef.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, powerPreference: 'low-power'});
    } catch {
      setFallback(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 30);
    camera.position.set(0, .3, 5.8);
    camera.lookAt(0, -.08, 0);
    const pivot = new THREE.Group();
    scene.add(pivot);
    scene.add(new THREE.HemisphereLight('#e7e8de', '#25292c', 2.2));
    const key = new THREE.DirectionalLight('#fff0d1', 3.8);
    key.position.set(-3, 5, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight('#e0e8ba', 2.5);
    rim.position.set(4, 1, -3);
    scene.add(rim);
    let mesh: THREE.Mesh | null = null, frame = 0, spinning = false, stopped = false, previousTime = 0;
    let rotationX = -.08, rotationY = -.32, zoom = 1;
    let activePointer: number | null = null, lastX = 0, lastY = 0;
    const draw = () => {
      if (stopped) return;
      pivot.rotation.set(rotationX, rotationY, 0);
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      canvas.dataset.renderer = 'three-webgl';
      canvas.dataset.calls = String(renderer.info.render.calls);
      canvas.dataset.triangles = String(renderer.info.render.triangles);
      canvas.dataset.geometries = String(renderer.info.memory.geometries);
      canvas.dataset.textures = String(renderer.info.memory.textures);
      canvas.dataset.rotation = `${rotationX.toFixed(3)},${rotationY.toFixed(3)}`;
      canvas.dataset.zoom = zoom.toFixed(3);
    };
    const tick = (time: number) => {
      frame = 0;
      if (!spinning || stopped || document.hidden) return;
      if (previousTime) rotationY += Math.min(time - previousTime, 40) * .00022;
      previousTime = time;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const startAnimation = () => {
      previousTime = 0;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (spinning && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const changeZoom = (amount: number) => { zoom = THREE.MathUtils.clamp(zoom + amount, .7, 1.55); draw(); };
    const reset = () => { rotationX = -.08; rotationY = -.32; zoom = 1; draw(); };
    viewer.current = {
      clear() {
        if (mesh) { pivot.remove(mesh); disposeMesh(mesh); mesh = null; }
        draw();
      },
      setSprite(sprite) {
        const next = makeGear(sprite);
        if (mesh) { pivot.remove(mesh); disposeMesh(mesh); }
        mesh = next;
        pivot.add(mesh);
        draw();
      },
      reset,
      zoom: changeZoom,
      spin(value) { spinning = value; startAnimation(); },
    };
    const resize = () => {
      const width = Math.max(1, canvas.clientWidth), height = Math.max(1, canvas.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // A tall viewport keeps the entire model inside the narrower horizontal field of view.
      camera.position.z = camera.aspect < .9 ? 5.8 * .9 / camera.aspect : 5.8;
      draw();
    };
    const down = (event: PointerEvent) => {
      if (activePointer !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
      activePointer = event.pointerId;
      lastX = event.clientX; lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.focus({preventScroll: true});
      canvas.dataset.dragging = 'true';
    };
    const move = (event: PointerEvent) => {
      if (event.pointerId !== activePointer) return;
      rotationY += (event.clientX - lastX) * .012;
      rotationX = THREE.MathUtils.clamp(rotationX + (event.clientY - lastY) * .009, -1.1, 1.1);
      lastX = event.clientX; lastY = event.clientY;
      draw();
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId !== activePointer) return;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      activePointer = null;
      canvas.dataset.dragging = 'false';
    };
    const wheel = (event: WheelEvent) => { event.preventDefault(); changeZoom(-Math.sign(event.deltaY) * .08); };
    const keyboard = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', '0', 'Home'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft') rotationY -= .15;
      if (event.key === 'ArrowRight') rotationY += .15;
      if (event.key === 'ArrowUp') rotationX = Math.max(-1.1, rotationX - .12);
      if (event.key === 'ArrowDown') rotationX = Math.min(1.1, rotationX + .12);
      if (event.key === '+' || event.key === '=') changeZoom(.1);
      if (event.key === '-') changeZoom(-.1);
      if (event.key === 'Home' || event.key === '0') reset();
      draw();
    };
    const contextLost = (event: Event) => { event.preventDefault(); stopped = true; setAutoRotate(false); setFallback(true); };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('lostpointercapture', up);
    canvas.addEventListener('wheel', wheel, {passive: false});
    canvas.addEventListener('keydown', keyboard);
    canvas.addEventListener('webglcontextlost', contextLost);
    document.addEventListener('visibilitychange', startAnimation);
    resize();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewer.current = null;
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('lostpointercapture', up);
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('keydown', keyboard);
      canvas.removeEventListener('webglcontextlost', contextLost);
      document.removeEventListener('visibilitychange', startAnimation);
      if (mesh) disposeMesh(mesh);
      key.shadow.map?.dispose();
      renderer.dispose();
    };
  }, [fallback]);

  useEffect(() => { viewer.current?.spin(autoRotate && !reducedMotion); }, [autoRotate, reducedMotion]);

  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    setError('');
    setReady(false);
    if (fallback) {
      const canvas = canvasRef.current!;
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    } else viewer.current?.clear();
    composeGear(build).then(sprite => {
      if (cancelled) return;
      if (!fallback) {
        if (viewer.current) { viewer.current.setSprite(sprite); setReady(true); }
        return;
      }
      const canvas = canvasRef.current!;
      const draw = () => {
        const dpr = Math.min(devicePixelRatio, 2);
        canvas.width = Math.max(1, canvas.clientWidth * dpr);
        canvas.height = Math.max(1, canvas.clientHeight * dpr);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        const size = Math.min(canvas.width, canvas.height) * .77;
        ctx.drawImage(sprite, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size);
      };
      observer = new ResizeObserver(draw);
      observer.observe(canvas);
      draw();
      setReady(true);
    }).catch(() => { if (!cancelled) setError('贴图加载失败，属性计算仍可使用'); });
    return () => { cancelled = true; observer?.disconnect(); };
  }, [build.gear, build.parts, fallback]);

  return <div className="gear-viewport" ref={holder}>
    <canvas key={fallback ? 'fallback' : 'webgl'} id="gear-art" ref={canvasRef} tabIndex={fallback ? -1 : 0}
      data-renderer={fallback ? 'canvas-2d-fallback' : 'three-webgl'}
      data-gear={build.gear} data-ready={ready}
      aria-label={E.names[build.gear] + (fallback ? '材质平面预览' : '立体材质预览，拖动或方向键旋转，加减键缩放，Home 复位')}
      aria-describedby="viewer-hint" style={{touchAction: fallback ? 'pan-y' : 'none'}} />
    <div className="viewer-controls" aria-label="预览视角控制">
      <button type="button" onClick={() => viewer.current?.zoom(-.12)} disabled={fallback} aria-label="缩小预览">−</button>
      <button type="button" onClick={() => viewer.current?.reset()} disabled={fallback}>复位视角</button>
      <button type="button" onClick={() => viewer.current?.zoom(.12)} disabled={fallback} aria-label="放大预览">＋</button>
      <button type="button" onClick={() => setAutoRotate(value => !value)} disabled={fallback || reducedMotion} aria-pressed={autoRotate} title={reducedMotion ? '已遵循系统减少动态效果设置' : '切换自动旋转'}>{autoRotate ? '停止旋转' : '自动旋转'}</button>
    </div>
    <span id="viewer-hint" className="viewer-hint">{fallback ? '当前设备使用 2D 材质预览' : '拖动旋转 · 滚轮缩放'}</span>
    {error && <span className="art-error" role="status">{error}</span>}
  </div>;
}
