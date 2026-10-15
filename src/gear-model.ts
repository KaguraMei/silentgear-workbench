import * as THREE from 'three';
import E, {type Build} from './engine.js';
import {data} from './data-model';

const textureSet = new Set(data.textures);
const images = new Map<string, Promise<HTMLImageElement>>();
function load(path: string) {
  if (!images.has(path)) images.set(path, new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => { images.delete(path); reject(new Error('贴图加载失败')); };
    image.src = import.meta.env.BASE_URL + path;
  }));
  return images.get(path)!;
}

/** The same original mod layers supply both the WebGL mesh and the 2D fallback. */
export async function composeGear(build: Build) {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 32;
  const ctx = sprite.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  let painted = 0;
  for (const slot of ['rod', 'main', 'coating', 'binding', 'grip', 'cord', 'tip', 'fletching', 'adornment']) {
    const part = build.parts[slot];
    if (!part?.material) continue;
    const mat = data.materials[part.material];
    const layers = E.chain(build.gear).map(g => mat.model?.[slot + '/' + g]).find(Boolean) || [];
    for (const layer of layers) {
      const suffix = layer.texture.split(':').pop()!;
      let path = 'textures/' + build.gear + '/' + suffix + '.png';
      if (!textureSet.has(path)) {
        path = 'textures/' + build.gear + '/' + slot + '_generic_hc.png';
        if (!textureSet.has(path)) continue;
      }
      const image = await load(path);
      const tint = document.createElement('canvas');
      tint.width = tint.height = 32;
      const tc = tint.getContext('2d')!;
      tc.imageSmoothingEnabled = false;
      tc.drawImage(image, 0, 0, 32, 32);
      if (layer.color) {
        tc.globalCompositeOperation = 'multiply';
        tc.fillStyle = layer.color;
        tc.fillRect(0, 0, 32, 32);
        tc.globalCompositeOperation = 'destination-in';
        tc.drawImage(image, 0, 0, 32, 32);
      }
      ctx.drawImage(tint, 0, 0);
      painted++;
    }
    if (slot === 'main' && textureSet.has('textures/' + build.gear + '/guard_generic_hc.png')) {
      ctx.drawImage(await load('textures/' + build.gear + '/guard_generic_hc.png'), 0, 0, 32, 32);
    }
  }
  if (!painted) throw new Error('该装备暂无可用贴图');
  const pixels = ctx.getImageData(0, 0, 32, 32).data;
  if (!pixels.some((value, index) => index % 4 === 3 && value > 32)) throw new Error('装备贴图为空');
  return sprite;
}

/** Merge exposed pixel faces into one mesh: original pixel silhouette, real solid edges. */
export function makeGear(sprite: HTMLCanvasElement) {
  const {data: pixels, width, height} = sprite.getContext('2d')!.getImageData(0, 0, sprite.width, sprite.height);
  const solid = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height && pixels[(y * width + x) * 4 + 3] > 32;
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (solid(x, y)) {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x + 1);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y + 1);
  }
  if (minX === width) throw new Error('装备贴图为空');
  const scale = 2.65 / Math.max(maxX - minX, maxY - minY);
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const positions: number[] = [], colors: number[] = [], normals: number[] = [];
  const sidePositions: number[] = [], sideColors: number[] = [], sideNormals: number[] = [];
  const color = new THREE.Color();
  const face = (corners: number[][], normal: number[], side = false) => {
    const p = side ? sidePositions : positions, c = side ? sideColors : colors, n = side ? sideNormals : normals;
    for (const i of [0, 1, 2, 0, 2, 3]) {
      p.push(...corners[i]); n.push(...normal); c.push(color.r, color.g, color.b);
    }
  };
  const z = .105;
  for (let y = minY; y < maxY; y++) for (let x = minX; x < maxX; x++) if (solid(x, y)) {
    const p = (y * width + x) * 4;
    color.setRGB(pixels[p] / 255, pixels[p + 1] / 255, pixels[p + 2] / 255, THREE.SRGBColorSpace);
    const l = (x - cx) * scale, r = l + scale, t = (cy - y) * scale, b = t - scale;
    face([[l,b,z],[r,b,z],[r,t,z],[l,t,z]], [0,0,1]);
    face([[r,b,-z],[l,b,-z],[l,t,-z],[r,t,-z]], [0,0,-1]);
    if (!solid(x - 1, y)) face([[l,b,-z],[l,b,z],[l,t,z],[l,t,-z]], [-1,0,0], true);
    if (!solid(x + 1, y)) face([[r,b,z],[r,b,-z],[r,t,-z],[r,t,z]], [1,0,0], true);
    if (!solid(x, y - 1)) face([[l,t,z],[r,t,z],[r,t,-z],[l,t,-z]], [0,1,0], true);
    if (!solid(x, y + 1)) face([[l,b,-z],[r,b,-z],[r,b,z],[l,b,z]], [0,-1,0], true);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions.concat(sidePositions), 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors.concat(sideColors), 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals.concat(sideNormals), 3));
  geometry.addGroup(0, positions.length / 3, 0);
  geometry.addGroup(positions.length / 3, sidePositions.length / 3, 1);
  geometry.computeBoundingSphere();
  const material = [
    new THREE.MeshStandardMaterial({vertexColors: true, roughness: .56, metalness: .28}),
    new THREE.MeshStandardMaterial({vertexColors: true, roughness: .36, metalness: .46}),
  ];
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'original-texture-extrusion';
  mesh.castShadow = true;
  return mesh;
}

export function disposeMesh(mesh: THREE.Mesh) {
  mesh.geometry.dispose();
  for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) material.dispose();
}
