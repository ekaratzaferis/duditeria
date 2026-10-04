import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { imageToSVG } from './four20.js';

// Terraced relief: an image is split into brightness bands, each band is traced
// to SVG by four20, extruded, and stacked — darkest areas end up highest.

const MAX_SIDE = 280;          // tracing resolution (long side, px)
const LAYER_DEPTH = 7;         // extrusion per layer, in SVG units

// Amber ramp from the base (deep) to the top layer (bright)
const RAMP = ['#2a1d0c', '#5a3a12', '#8f5a14', '#c47d16', '#f0a21f', '#ffc65c', '#ffe3a8'];

function rampColors(n) {
  if (n === 1) return [RAMP[RAMP.length - 1]];
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const idx = t * (RAMP.length - 1);
    const a = new THREE.Color(RAMP[Math.floor(idx)]);
    const b = new THREE.Color(RAMP[Math.ceil(idx)]);
    return '#' + a.lerp(b, idx - Math.floor(idx)).getHexString();
  });
}

// ── Sources → canvas ─────────────────────────────────────────────────────────

function fitCanvas(w, h) {
  const s = Math.min(1, MAX_SIDE / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * s));
  c.height = Math.max(1, Math.round(h * s));
  return c;
}

function drawSource(source, blurPx) {
  const w = source.videoWidth || source.naturalWidth || source.width;
  const h = source.videoHeight || source.naturalHeight || source.height;
  const c = fitCanvas(w, h);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.filter = `blur(${blurPx}px)`;
  ctx.drawImage(source, 0, 0, c.width, c.height);
  ctx.filter = 'none';
  return c;
}

async function textCanvas(text, font) {
  await document.fonts.load(`200px "${font}"`).catch(() => {});
  const W = 900, H = 320;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let size = 260;
  while (size > 20) {
    ctx.font = `${size}px "${font}"`;
    if (ctx.measureText(text).width <= W * 0.86) break;
    size -= 6;
  }
  ctx.fillStyle = '#000';
  ctx.fillText(text, W / 2, H / 2);
  return c;
}

// ── Tracing ──────────────────────────────────────────────────────────────────

function luminance(canvas) {
  const { width: w, height: h } = canvas;
  const d = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
  const lum = new Float32Array(w * h);
  for (let i = 0; i < lum.length; i++) {
    lum[i] = 0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2];
  }
  return lum;
}

// Thresholds at evenly spaced quantiles of the darker part of the image,
// so every layer covers a meaningful area whatever the photo's exposure.
function thresholds(lum, levels, invert, fixed) {
  if (fixed) {
    // Evenly spaced cut-offs through the blurred ink: outer halo → letter core
    const lo = 70, hi = 225;
    return Array.from({ length: levels }, (_, k) => {
      const t = hi - (k / Math.max(1, levels - 1)) * (hi - lo);
      return invert ? 255 - t : t;
    });
  }
  const sorted = Array.from(lum).sort((a, b) => (invert ? b - a : a - b));
  const cover = 0.7; // the base layer covers the darkest 70% of pixels
  const out = [];
  for (let k = 0; k < levels; k++) {
    const q = cover * (1 - k / levels);
    out.push(sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]);
  }
  return out; // base (widest) first
}

function bandImage(lum, w, h, t, invert) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  for (let i = 0; i < lum.length; i++) {
    const inside = invert ? lum[i] >= t : lum[i] <= t;
    const v = inside ? 0 : 255;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

async function traceLayers(canvas, levels, invert, fixed = false) {
  const lum = luminance(canvas);
  const ts = thresholds(lum, levels, invert, fixed);
  const layers = [];
  // four20 keeps tracer state in a module-level worker: trace sequentially.
  for (const t of ts) {
    try {
      const res = await imageToSVG({ src: bandImage(lum, canvas.width, canvas.height, t, invert), trimWhiteSpace: false });
      if (res?.svg) layers.push(res.svg);
    } catch {
      // blank band — nothing to trace at this level
    }
  }
  return { layers, width: canvas.width, height: canvas.height };
}

// ── Engine ───────────────────────────────────────────────────────────────────

export async function initFour20Engine(canvas, refs) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x08080a);

  const camera = new THREE.PerspectiveCamera(32, 1, 1, 5000);

  scene.add(new THREE.HemisphereLight(0xc8ccff, 0x1a1208, 0.6));
  const key = new THREE.DirectionalLight(0xfff1dc, 2.6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.6;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x7f8cff, 0.8);
  scene.add(rim);

  // Pivot holds the relief; drag rotates it, idle sway animates it.
  const pivot = new THREE.Group();
  scene.add(pivot);

  let relief = null;
  const materials = [];

  function clearRelief() {
    if (!relief) return;
    pivot.remove(relief);
    relief.traverse((o) => o.isMesh && o.geometry.dispose());
    relief = null;
  }

  function buildRelief({ layers, width, height }) {
    clearRelief();
    materials.forEach((m) => m.dispose());
    materials.length = 0;
    if (!layers.length) return;

    const colors = rampColors(layers.length);
    const loader = new SVGLoader();
    const group = new THREE.Group();

    layers.forEach((svg, i) => {
      const geos = [];
      for (const path of loader.parse(svg).paths) {
        for (const shape of SVGLoader.createShapes(path)) {
          const g = new THREE.ExtrudeGeometry(shape, {
            depth: LAYER_DEPTH,
            bevelEnabled: true,
            bevelThickness: 0.8,
            bevelSize: 0.5,
            bevelSegments: 1,
            curveSegments: 5,
          });
          g.deleteAttribute('uv');
          geos.push(g);
        }
      }
      if (!geos.length) return;
      const merged = mergeGeometries(geos, false);
      geos.forEach((g) => g.dispose());
      const mat = new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.55, metalness: 0.08 });
      materials.push(mat);
      const mesh = new THREE.Mesh(merged, mat);
      mesh.position.z = i * LAYER_DEPTH;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    });

    // SVG Y points down; centre the relief on the pivot
    group.scale.y = -1;
    group.position.set(-width / 2, height / 2, -(layers.length * LAYER_DEPTH) / 2);
    relief = new THREE.Group();
    relief.add(group);
    pivot.add(relief);

    frame(width, height, layers.length * LAYER_DEPTH);
  }

  let lastSize = { w: 1, h: 1, d: 1 };

  function frame(w = lastSize.w, h = lastSize.h, d = lastSize.d) {
    lastSize = { w, h, d };
    const cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (!cw || !ch) return;
    camera.aspect = cw / ch;
    renderer.setSize(cw, ch, false);

    const narrow = camera.aspect < 0.9;
    const radius = Math.hypot(w, h, d) / 2;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const fit = narrow ? 1.35 : 1.5;
    const dist = (radius / Math.sin(fov / 2)) * fit / Math.min(1, camera.aspect);

    // Keep the relief in the upper-middle, clear of the title card (bottom-left)
    // and the control panel (bottom-right / bottom on mobile)
    const shiftX = 0;
    const shiftY = narrow ? -radius * 0.55 : -radius * 0.28;
    camera.position.set(shiftX, shiftY + dist * 0.12, dist);
    camera.lookAt(shiftX, shiftY, 0);
    camera.updateProjectionMatrix();

    key.position.set(-radius * 1.2, radius * 1.6, radius * 2.2);
    key.target.position.set(0, 0, 0);
    const sc = key.shadow.camera;
    sc.left = sc.bottom = -radius * 1.3;
    sc.right = sc.top = radius * 1.3;
    sc.near = 1;
    sc.far = radius * 6;
    sc.updateProjectionMatrix();
    rim.position.set(radius * 2, -radius, -radius);
  }

  const ro = new ResizeObserver(() => frame());
  ro.observe(canvas);

  // ── Drag to rotate (mouse only, so touch still scrolls the page) ──────────
  let drag = null;
  let yaw = 0, pitch = 0, userYaw = 0, userPitch = 0;
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    drag = { x: e.clientX, y: e.clientY, yaw: userYaw, pitch: userPitch };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    userYaw = drag.yaw + (e.clientX - drag.x) * 0.008;
    userPitch = THREE.MathUtils.clamp(drag.pitch + (e.clientY - drag.y) * 0.006, -0.9, 0.9);
  });
  const endDrag = () => (drag = null);
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  // ── Loop ──────────────────────────────────────────────────────────────────
  let raf = 0;
  function loop(t) {
    raf = requestAnimationFrame(loop);
    const sway = reduced || drag ? 0 : Math.sin(t * 0.0005) * 0.35;
    yaw += (userYaw + sway - yaw) * 0.08;
    pitch += (userPitch - 0.18 - pitch) * 0.08;
    pivot.rotation.set(pitch, yaw, 0);
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(loop);

  // ── UI state ──────────────────────────────────────────────────────────────
  const state = {
    source: refs.root?.dataset.source || 'text',
    levels: Number(refs.levels?.value) || 5,
    invert: false,
    text: refs.textInput?.value || 'four20',
    font: refs.fontSelect?.value || 'Permanent Marker',
    image: null,          // HTMLImageElement | ImageBitmap | HTMLCanvasElement
  };

  let portrait = null;
  async function loadPortrait() {
    if (portrait) return portrait;
    portrait = new Image();
    portrait.src = refs.portraitSrc || '/four20-portrait.jpg';
    await portrait.decode();
    return portrait;
  }

  function setBusy(on) {
    refs.root?.classList.toggle('busy', on);
  }

  function updatePreview({ layers, width, height }) {
    if (!refs.svgPreview) return;
    const colors = rampColors(layers.length);
    const parser = new DOMParser();
    const paths = layers
      .map((svg, i) => {
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        return Array.from(doc.querySelectorAll('path'))
          .map((p) => `<path d="${p.getAttribute('d')}" fill="${colors[i]}" fill-rule="evenodd"/>`)
          .join('');
      })
      .join('');
    refs.svgPreview.innerHTML =
      `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">${paths}</svg>`;
    if (refs.stats) {
      const n = layers.reduce((acc, svg) => acc + (svg.match(/<path/g)?.length ?? 0), 0);
      refs.stats.textContent = `${layers.length} layers · ${n} paths`;
    }
  }

  let runId = 0;
  async function run() {
    const id = ++runId;
    setBusy(true);
    try {
      let src;
      if (state.source === 'text') {
        // Heavy blur turns crisp letters into soft hills, so each band is a
        // slightly smaller outline — stacked, they read as inflated type.
        src = drawSource(await textCanvas(state.text || ' ', state.font), 3.5);
      } else if (state.source === 'portrait') {
        src = drawSource(await loadPortrait(), 1.2);
      } else if (state.image) {
        src = drawSource(state.image, 1.2);
      } else {
        return;
      }
      const result = await traceLayers(src, state.levels, state.invert, state.source === 'text');
      if (id !== runId) return;
      buildRelief(result);
      updatePreview(result);
    } catch (err) {
      console.warn('[four20] trace failed:', err);
    } finally {
      if (id === runId) setBusy(false);
    }
  }

  // ── Controls ──────────────────────────────────────────────────────────────
  let stream = null;
  function stopCamera() {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    refs.root?.classList.remove('camera-live');
  }

  function selectSource(name) {
    state.source = name;
    refs.sourceTabs?.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.source === name)));
    refs.root?.setAttribute('data-source', name);
    if (name !== 'camera') stopCamera();
    if (name === 'portrait' || name === 'text') run();
    if (name === 'upload') refs.fileInput?.click();
    if (name === 'camera') startCamera();
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia || !refs.video) return;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640 }, audio: false });
      refs.video.srcObject = stream;
      await refs.video.play();
      refs.root?.classList.add('camera-live');
    } catch {
      refs.root?.classList.add('camera-denied');
    }
  }

  refs.sourceTabs?.forEach((b) => b.addEventListener('click', () => selectSource(b.dataset.source)));

  refs.captureBtn?.addEventListener('click', () => {
    if (!refs.video || !stream) return;
    const v = refs.video;
    const c = document.createElement('canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext('2d');
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1); // mirror, like the preview
    ctx.drawImage(v, 0, 0);
    state.image = c;
    stopCamera();
    run();
  });

  refs.fileInput?.addEventListener('change', async () => {
    const file = refs.fileInput.files?.[0];
    if (!file) return;
    try {
      state.image = await createImageBitmap(file);
      run();
    } catch (err) {
      console.warn('[four20] could not read image:', err);
    }
    refs.fileInput.value = '';
  });

  let textTimer;
  refs.textInput?.addEventListener('input', () => {
    state.text = refs.textInput.value.trim();
    clearTimeout(textTimer);
    textTimer = setTimeout(run, 350);
  });
  refs.fontSelect?.addEventListener('change', () => {
    state.font = refs.fontSelect.value;
    run();
  });

  refs.levels?.addEventListener('input', () => {
    state.levels = Number(refs.levels.value);
    if (refs.levelsOut) refs.levelsOut.textContent = String(state.levels);
    clearTimeout(textTimer);
    textTimer = setTimeout(run, 200);
  });

  refs.invertBtn?.addEventListener('click', () => {
    state.invert = !state.invert;
    refs.invertBtn.setAttribute('aria-pressed', String(state.invert));
    run();
  });

  frame();
  await run();

  return function dispose() {
    runId++;
    cancelAnimationFrame(raf);
    ro.disconnect();
    stopCamera();
    clearRelief();
    materials.forEach((m) => m.dispose());
    renderer.dispose();
  };
}
