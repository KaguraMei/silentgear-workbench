import {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import E, {type Build} from './engine.js';
import {composeGear, makeGear, disposeMesh} from './gear-model';
export function BackgroundCanvas(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const canvas=ref.current!,ctx=canvas.getContext('2d')!;function draw(){const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#101714';ctx.fillRect(0,0,w,h);const gradient=ctx.createRadialGradient(w*.5,h*.43,20,w*.5,h*.43,w*.52);gradient.addColorStop(0,'#2a3e2b');gradient.addColorStop(.5,'#18261e');gradient.addColorStop(1,'#101714');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);ctx.strokeStyle='#a9c9aa09';ctx.lineWidth=1;ctx.beginPath();for(let x=w%40;x<w;x+=40){ctx.moveTo(x,0);ctx.lineTo(x,h);}for(let y=h%40;y<h;y+=40){ctx.moveTo(0,y);ctx.lineTo(w,y);}ctx.stroke();ctx.fillStyle='#adc5ac35';for(let x=w%160;x<w;x+=160)for(let y=h%160;y<h;y+=160){ctx.fillRect(x-2,y,5,1);ctx.fillRect(x,y-2,1,5);}ctx.strokeStyle='#b4cea212';ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.stroke();}draw();window.addEventListener('resize',draw);return()=>window.removeEventListener('resize',draw);},[]);
 return <canvas id="world" ref={ref} aria-hidden="true"/>;
}


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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 30);
    camera.position.set(0, .3, 6.3);
    camera.lookAt(0, -.08, 0);
    const pivot = new THREE.Group();
    scene.add(pivot);
    scene.add(new THREE.HemisphereLight('#d8e8d0', '#3b4337', 2.4));
    const key = new THREE.DirectionalLight('#fff0d1', 3.8);
    key.position.set(-3, 5, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    key.shadow.camera.left = key.shadow.camera.bottom = -3;
    key.shadow.camera.right = key.shadow.camera.top = 3;
    key.shadow.normalBias = .025;
    scene.add(key);
    const rim = new THREE.DirectionalLight('#a6d6bf', 3);
    rim.position.set(4, 1, -3);
    scene.add(rim);
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.45, .13, 8), new THREE.MeshStandardMaterial({color: '#30372b', roughness: .84, metalness: .18}));
    pedestal.position.y = -1.62;
    pedestal.receiveShadow = true;
    scene.add(pedestal);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, .025, 8), new THREE.MeshStandardMaterial({color: '#556343', roughness: .7, metalness: .28}));
    top.position.y = -1.54;
    top.receiveShadow = true;
    scene.add(top);
    const trim = new THREE.Mesh(new THREE.TorusGeometry(1.32, .012, 4, 8), new THREE.MeshStandardMaterial({color: '#c4a66c', roughness: .42, metalness: .55}));
    trim.rotation.x = Math.PI / 2;
    trim.position.y = -1.54;
    scene.add(trim);
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
      camera.position.z = camera.aspect < .9 ? 6.3 * .9 / camera.aspect : 6.3;
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
      for (const item of [pedestal, top, trim]) disposeMesh(item);
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
