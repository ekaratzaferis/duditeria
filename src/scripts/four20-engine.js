import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { imageToSVG } from './four20.js';

// ─── Text → canvas (white bg) → imageToSVG ────────────────────────────────────
async function renderTextToSVG(text, fontFamily, invert) {
  if (!['Arial', 'Impact', 'Georgia', 'Times New Roman'].includes(fontFamily)) {
    await document.fonts.load(`120px "${fontFamily}"`);
  }

  const W = 800, H = 200;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  let size = 1000;
  const pad = W * 0.04;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  while (size > 10) {
    ctx.font = `${size}px "${fontFamily}"`;
    if (ctx.measureText(text).width <= W - pad * 2 && size <= H * 0.85) break;
    size = Math.floor(size * 0.97);
  }

  ctx.fillStyle = '#000000';
  ctx.fillText(text, W / 2, H / 2);

  const src = c.toDataURL('image/png');
  return imageToSVG({ src, trimWhiteSpace: true, applyStretch: true, invert });
}

// ─── Public ───────────────────────────────────────────────────────────────────

export async function initFour20Engine(canvas, refs) {
  // ─── Renderer ──────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x7b3fa8, 1); // Lakers purple (lightened)
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100000);

  // ─── Lights ────────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffeebb, 0.45));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(200, 400, 300);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xcc99ff, 0.7);
  rimLight.position.set(-300, -100, 100);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0x331a00, 0.4);
  fillLight.position.set(0, -400, -200);
  scene.add(fillLight);

  // ─── State ─────────────────────────────────────────────────────────────────
  let currentGroup = null;
  let animId;
  let mode = 'text';
  let inverted = false;

  // ─── Bounce animation state ─────────────────────────────────────────────────
  let bounceAnims = [];  // { mesh, baseZ, startTime, duration, dist }
  let bounceTimerId = null;

  const wireframeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffee00,
    emissive: 0xffcc00,
    emissiveIntensity: 0.6,
    metalness: 0.6,
    roughness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    side: THREE.DoubleSide,
  });

  function clearBounce() {
    if (bounceTimerId) { clearTimeout(bounceTimerId); bounceTimerId = null; }
    // restore materials for any in-flight anims
    for (const anim of bounceAnims) anim.mesh.material = sharedMat;
    bounceAnims = [];
  }

  function setupBounce(group) {
    clearBounce();
    const meshes = [];
    group.traverse(obj => { if (obj.isMesh) meshes.push(obj); });
    if (!meshes.length) return;

    let idx = 0;
    const next = () => {
      if (!currentGroup || currentGroup !== group) return;
      const mesh = meshes[idx % meshes.length];
      mesh.material = wireframeMat;
      bounceAnims.push({
        mesh,
        baseZ: mesh.position.z,
        startTime: performance.now(),
        duration: 1300,
        dist: 45,
      });
      idx++;
      bounceTimerId = setTimeout(next, 1800);
    };
    next();
  }

  // ─── Resize ────────────────────────────────────────────────────────────────
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // ─── Animation loop ────────────────────────────────────────────────────────
  function animate() {
    animId = requestAnimationFrame(animate);

    const now = performance.now();
    bounceAnims = bounceAnims.filter(anim => {
      const t = Math.min((now - anim.startTime) / anim.duration, 1);
      // smooth arc: sin(t * PI) — 0 → peak → 0
      anim.mesh.position.z = anim.baseZ + Math.sin(t * Math.PI) * anim.dist;
      if (t >= 1) {
        anim.mesh.material = sharedMat;
        anim.mesh.position.z = anim.baseZ;
        return false;
      }
      return true;
    });

    renderer.render(scene, camera);
  }
  animate();

  // ─── Material ──────────────────────────────────────────────────────────────
  const sharedMat = new THREE.MeshPhysicalMaterial({
    color: 0xffe566,
    emissive: 0x554400,
    metalness: 0.6,
    roughness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    side: THREE.DoubleSide,
  });

  // ─── Build 3D from SVG string ──────────────────────────────────────────────
  function buildScene(svgString) {
    clearBounce();

    if (currentGroup) {
      scene.remove(currentGroup);
      currentGroup.traverse(obj => {
        if (obj.isMesh) obj.geometry.dispose();
      });
      currentGroup = null;
    }
    if (!svgString) return;

    const loader = new SVGLoader();
    const { paths } = loader.parse(svgString);
    if (!paths.length) return;

    const group = new THREE.Group();

    for (const path of paths) {
      const shapes = SVGLoader.createShapes(path);
      for (const shape of shapes) {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 35,
          bevelEnabled: true,
          bevelThickness: 3,
          bevelSize: 2,
          bevelSegments: 5,
        });
        group.add(new THREE.Mesh(geo, sharedMat));
      }
    }

    // SVG Y-axis is inverted relative to Three.js
    group.scale.y = -1;
    scene.add(group);

    // Center the group
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);

    // Fit camera — diagonal + elevated
    const sphere = new THREE.Sphere();
    new THREE.Box3().setFromObject(group).getBoundingSphere(sphere);
    const fov = camera.fov * (Math.PI / 180);
    const dist = (sphere.radius / Math.sin(fov / 2)) * 1.3;

    const isMobile = window.innerWidth <= 520;
    const zoomOut = isMobile ? 1.9 : 1.0;
    camera.position.set(dist * 0.45 * zoomOut, dist * 0.38 * zoomOut, dist * zoomOut);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    currentGroup = group;
    setupBounce(group);
  }

  // ─── SVG preview ───────────────────────────────────────────────────────────
  function updatePreview(svgString) {
    if (!refs.svgPreview) return;
    refs.svgPreview.innerHTML = svgString || '';
    const svg = refs.svgPreview.querySelector('svg');
    if (svg) {
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.cssText = 'width:100%;height:100%;display:block;';
    }
  }

  // ─── Pipeline ──────────────────────────────────────────────────────────────
  function process(svgString) {
    updatePreview(svgString);
    buildScene(svgString);
  }

  // ─── Text mode ─────────────────────────────────────────────────────────────
  let textTimer;

  async function runText() {
    const text = refs.textInput?.value?.trim() || 'LBJ';
    const fontFamily = refs.fontSelect?.value || 'Permanent Marker';
    try {
      const result = await renderTextToSVG(text, fontFamily, inverted);
      if (result?.svg) process(result.svg);
    } catch (e) {
      console.warn('[four20] runText error:', e);
    }
  }

  refs.textInput?.addEventListener('input', () => {
    clearTimeout(textTimer);
    textTimer = setTimeout(runText, 400);
  });
  refs.fontSelect?.addEventListener('change', runText);

  // ─── Draw mode ─────────────────────────────────────────────────────────────
  const drawCanvas = refs.drawCanvas;
  let drawCtx = null;

  let drawInited = false;

  function initDrawCanvas() {
    if (!drawCanvas || drawInited) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = drawCanvas.offsetWidth;
    const h = drawCanvas.offsetHeight;
    if (!w || !h) return; // still hidden — defer
    drawCanvas.width = w * dpr;
    drawCanvas.height = h * dpr;
    drawCtx = drawCanvas.getContext('2d');
    drawCtx.scale(dpr, dpr);
    drawCtx.fillStyle = '#ffffff';
    drawCtx.fillRect(0, 0, w, h);
    drawCtx.strokeStyle = '#000000';
    drawCtx.lineWidth = 4;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    drawInited = true;
  }

  async function runDraw() {
    if (!drawCanvas) return;
    try {
      const src = drawCanvas.toDataURL('image/png');
      const result = await imageToSVG({ src, invert: inverted, trimWhiteSpace: true, applyStretch: true });
      if (result?.svg) process(result.svg);
    } catch (e) {
      console.warn('[four20] runDraw error:', e);
    }
  }

  function getDrawPos(e) {
    const rect = drawCanvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: src.clientX - rect.left,
      y: src.clientY - rect.top,
    };
  }

  let drawing = false;

  function onDrawStart(e) {
    e.preventDefault();
    initDrawCanvas();
    if (!drawCtx) return;
    drawing = true;
    const p = getDrawPos(e);
    drawCtx.beginPath();
    drawCtx.moveTo(p.x, p.y);
  }

  function onDrawMove(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = getDrawPos(e);
    drawCtx.lineTo(p.x, p.y);
    drawCtx.stroke();
  }

  function onDrawEnd() {
    if (!drawing) return;
    drawing = false;
    drawCtx?.beginPath();
    if (mode === 'draw') runDraw();
  }

  if (drawCanvas) {
    drawCanvas.addEventListener('mousedown', onDrawStart);
    drawCanvas.addEventListener('mousemove', onDrawMove);
    drawCanvas.addEventListener('mouseup', onDrawEnd);
    drawCanvas.addEventListener('mouseleave', onDrawEnd);
    drawCanvas.addEventListener('touchstart', onDrawStart, { passive: false });
    drawCanvas.addEventListener('touchmove', onDrawMove, { passive: false });
    drawCanvas.addEventListener('touchend', onDrawEnd);
  }

  refs.clearBtn?.addEventListener('click', () => {
    if (!drawCtx || !drawCanvas) return;
    drawCtx.fillStyle = '#ffffff';
    // fillRect uses CSS pixels because we scaled the context by dpr
    drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    drawCtx.beginPath();
  });

  // ─── Mode switch ───────────────────────────────────────────────────────────
  function switchMode(m) {
    mode = m;
    refs.modeTextBtn?.classList.toggle('active', m === 'text');
    refs.modeDrawBtn?.classList.toggle('active', m === 'draw');
    refs.textControls?.classList.toggle('hidden', m !== 'text');
    refs.drawControls?.classList.toggle('hidden', m !== 'draw');
    if (m === 'text') runText();
    else { initDrawCanvas(); runDraw(); }
  }

  refs.modeTextBtn?.addEventListener('click', () => switchMode('text'));
  refs.modeDrawBtn?.addEventListener('click', () => switchMode('draw'));

  // ─── Invert ────────────────────────────────────────────────────────────────
  refs.invertBtn?.addEventListener('click', () => {
    inverted = !inverted;
    refs.invertBtn.classList.toggle('active', inverted);
    if (mode === 'text') runText();
    else runDraw();
  });

  // ─── Initial render ────────────────────────────────────────────────────────
  await runText();

  // ─── Dispose ───────────────────────────────────────────────────────────────
  return function dispose() {
    clearBounce();
    cancelAnimationFrame(animId);
    ro.disconnect();
    if (currentGroup) {
      scene.remove(currentGroup);
      currentGroup.traverse(obj => {
        if (obj.isMesh) obj.geometry.dispose();
      });
    }
    sharedMat.dispose();
    wireframeMat.dispose();
    renderer.dispose();
  };
}
