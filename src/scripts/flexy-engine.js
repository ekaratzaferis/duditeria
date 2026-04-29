import * as THREE from 'three';
import * as flexy from 'flexy-bend';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// ── Toggle ─────────────────────────────────────────────────────────────────
const SHOW_PARTICLES = true;

let seed = 42;
function rand() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}



function makeCircleTexture(size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0,   'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.7)');
  grad.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}


// ── Leaf geometry ─────────────────────────────────────────────────────────
function buildLeafGeometry(height, baseW) {
  const SEG = 10;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG;
    // Narrow at base, quickly reach full width, stay wide, taper sharply to tip
    const ramp  = Math.min(t / 0.12, 1);
    const taper = Math.pow(1 - t, 0.35);
    const w = baseW * ramp * taper;
    pos.push(-w / 2, t * height, 0,   w / 2, t * height, 0);
    uv.push(0, t,  1, t);
  }
  // Tip vertex
  pos.push(0, height * 1.05, 0);
  uv.push(0.5, 1.05);

  for (let i = 0; i < SEG; i++) {
    const bl = i*2, br = i*2+1, tl = (i+1)*2, tr = (i+1)*2+1;
    idx.push(bl, br, tl,  br, tr, tl);
  }
  idx.push(SEG*2, SEG*2+1, (SEG+1)*2);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uv,  2));
  geo.setIndex(idx);
  return geo;
}

// ── Leaf curve + orientation ───────────────────────────────────────────────
const PLANT_Z = 4;

const _leanDir = new THREE.Vector3();
const _yAxis   = new THREE.Vector3(0, 1, 0);

// leanX, leanY: normalised -1..1 (mouse/touch mapped to screen)
function buildLeafCurve(leaf, leanX, leanY) {
  // Virtual point the plant "looks at"
  const targetX = leanX * 45;
  const targetZ = -30;
  const dx = targetX, dz = targetZ - PLANT_Z;
  const len = Math.sqrt(dx * dx + dz * dz);
  const baseDirX = dx / len, baseDirZ = dz / len;

  _leanDir.set(baseDirX, 0, baseDirZ).applyAxisAngle(_yAxis, leaf.spreadAngle);

  const { rootX, height, leanFactor } = leaf;
  const tipX = rootX + _leanDir.x * leanFactor * height;
  // Mouse Y: -1 = top of screen (lean up), 1 = bottom (droop down)
  const tipY = height * (0.85 - leanY * 0.28);
  const tipZ = PLANT_Z + _leanDir.z * leanFactor * height;

  const P0 = new THREE.Vector3(rootX, 0, PLANT_Z);
  const P1 = new THREE.Vector3(
    rootX + _leanDir.x * 0.08,
    height * 0.28,
    PLANT_Z + _leanDir.z * 0.08
  );
  const P2 = new THREE.Vector3(rootX * 0.2 + tipX * 0.8, height * 0.72, PLANT_Z * 0.2 + tipZ * 0.8);
  const P3 = new THREE.Vector3(tipX, tipY, tipZ);

  // Orientation: perpendicular to the curve's plane
  const orientation = new THREE.Vector3(-_leanDir.z, 0, _leanDir.x).normalize();
  if (orientation.lengthSq() < 0.001) orientation.set(1, 0, 0);

  return { curve: new THREE.CubicBezierCurve3(P0, P1, P2, P3), orientation };
}

// ── Leaf definitions ───────────────────────────────────────────────────────
const LEAF_DEFS = [
  { height: 4.0, baseW: 0.40, rootX: -0.10, spreadAngle: -0.61, leanFactor: 0.75 },
  { height: 3.5, baseW: 0.35, rootX:  0.12, spreadAngle:  0.35, leanFactor: 0.70 },
  { height: 3.2, baseW: 0.32, rootX: -0.18, spreadAngle: -0.96, leanFactor: 0.65 },
  { height: 2.6, baseW: 0.28, rootX:  0.15, spreadAngle:  0.79, leanFactor: 0.62 },
  { height: 3.8, baseW: 0.38, rootX: -0.06, spreadAngle: -0.09, leanFactor: 0.72 },
  { height: 2.2, baseW: 0.25, rootX:  0.20, spreadAngle:  1.13, leanFactor: 0.58 },
  { height: 2.9, baseW: 0.30, rootX: -0.15, spreadAngle: -1.22, leanFactor: 0.63 },
  { height: 2.5, baseW: 0.27, rootX:  0.10, spreadAngle:  0.52, leanFactor: 0.60 },
];

export function initFlexyEngine(canvas) {
  // ── Renderer ──────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ── Scene ─────────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0e8);
  scene.fog = new THREE.Fog(0xe8e4dc, 5, 32);

  // ── Camera ────────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.4, 10);
  camera.lookAt(0, 1.2, 0);

  // ── Shared material ────────────────────────────────────────────────────────
  const mat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

  // ── Ground ────────────────────────────────────────────────────────────────
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), mat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // ── Grass ─────────────────────────────────────────────────────────────────
  const VERT = /* glsl */`
    attribute float aPhase;
    attribute float aSpeed;
    attribute float aAmplitude;
    attribute float aWorldX;
    uniform   float uTime;
    varying   float vDepth;

    void main() {
      float t   = uv.y;
      vec3  pos = position;
      pos.z += t * t * 0.09;
      float wave  = sin(uTime * aSpeed       + aWorldX * 0.55 + aPhase);
      float wave2 = sin(uTime * aSpeed * 2.3 + aPhase  * 1.7 ) * 0.22;
      float sway  = (wave + wave2) * aAmplitude * t * t;
      pos.x += sway;
      pos.z += sway * 0.25;
      #ifdef USE_INSTANCING
        vec4 mv = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
      #else
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      #endif
      vDepth      = -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `;

  const FRAG = /* glsl */`
    varying float vDepth;
    void main() {
      float f = smoothstep(5.0, 32.0, vDepth);
      gl_FragColor = vec4(mix(vec3(0.01), vec3(0.910, 0.894, 0.863), f), 1);
    }
  `;

  // Tapered blade geometry
  const SEG = 5, BASE_W = 0.055;
  const bPos = [], bUv = [], bIdx = [];
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG, w = BASE_W * (1 - t * t * 0.96);
    bPos.push(-w / 2, t, 0,  w / 2, t, 0);
    bUv.push(0, t,  1, t);
  }
  bPos.push(0, 1.08, 0); bUv.push(0.5, 1.08);
  for (let i = 0; i < SEG; i++) {
    const bl = i*2, br = i*2+1, tl = (i+1)*2, tr = (i+1)*2+1;
    bIdx.push(bl, br, tl,  br, tr, tl);
  }
  bIdx.push(SEG*2, SEG*2+1, (SEG+1)*2);

  const bladeGeo = new THREE.BufferGeometry();
  bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute(bPos, 3));
  bladeGeo.setAttribute('uv',       new THREE.Float32BufferAttribute(bUv,  2));
  bladeGeo.setIndex(bIdx);

  const COUNT = 600;
  const phases = new Float32Array(COUNT), speeds = new Float32Array(COUNT),
        amps   = new Float32Array(COUNT), wxs    = new Float32Array(COUNT);

  const grassMat = new THREE.ShaderMaterial({
    uniforms:       { uTime: { value: 0 } },
    vertexShader:   VERT,
    fragmentShader: FRAG,
    side:           THREE.DoubleSide,
  });

  const grassMesh = new THREE.InstancedMesh(bladeGeo, grassMat, COUNT);
  const dummy = new THREE.Object3D();

  const rows = [
    { z: 8.5, n: 150, spread: 14, h0: 0.30, h1: 0.60 },
    { z: 7.0, n: 130, spread: 16, h0: 0.35, h1: 0.70 },
    { z: 5.5, n: 110, spread: 18, h0: 0.25, h1: 0.55 },
    { z: 4.0, n: 100, spread: 20, h0: 0.30, h1: 0.65 },
    { z: 2.5, n: 110, spread: 22, h0: 0.25, h1: 0.50 },
  ];

  let idx = 0;
  for (const row of rows) {
    for (let i = 0; i < row.n && idx < COUNT; i++, idx++) {
      const h = row.h0 + rand() * (row.h1 - row.h0);
      const wx = (rand() - 0.5) * row.spread;
      dummy.position.set(wx, 0, row.z + (rand() - 0.5) * 1.2);
      dummy.rotation.set(0, rand() * Math.PI, 0);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      grassMesh.setMatrixAt(idx, dummy.matrix);
      phases[idx] = rand() * Math.PI * 2;
      speeds[idx] = 0.65 + rand() * 0.9;
      amps[idx]   = 0.13 + rand() * 0.22;
      wxs[idx]    = wx;
    }
  }

  bladeGeo.setAttribute('aPhase',     new THREE.InstancedBufferAttribute(phases, 1));
  bladeGeo.setAttribute('aSpeed',     new THREE.InstancedBufferAttribute(speeds, 1));
  bladeGeo.setAttribute('aAmplitude', new THREE.InstancedBufferAttribute(amps,   1));
  bladeGeo.setAttribute('aWorldX',    new THREE.InstancedBufferAttribute(wxs,    1));
  grassMesh.instanceMatrix.needsUpdate = true;
  // scene.add(grassMesh);

  // ── Particles ─────────────────────────────────────────────────────────────
  let particleState = null;
  if (SHOW_PARTICLES) {
    const P = 650;
    const pOrigins = new Float32Array(P * 3);
    const pPhases  = new Float32Array(P * 3);
    const pFreqs   = new Float32Array(P * 3);
    const pAmps    = new Float32Array(P * 3);
    const pPos     = new Float32Array(P * 3);

    for (let i = 0; i < P; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = 0.2 + Math.random() * 5.0;
      const z = -4 + Math.random() * 15;
      pOrigins[i*3] = x; pOrigins[i*3+1] = y; pOrigins[i*3+2] = z;
      pPos[i*3]     = x; pPos[i*3+1]     = y; pPos[i*3+2]     = z;
      for (let a = 0; a < 3; a++) {
        pPhases[i*3+a] = Math.random() * Math.PI * 2;
        pFreqs[i*3+a]  = 0.15 + Math.random() * 0.25;
        pAmps[i*3+a]   = 0.06 + Math.random() * 0.14;
      }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const circleTex = makeCircleTexture();
    const pMat = new THREE.PointsMaterial({
      color:           0x666666,
      size:            0.04,
      sizeAttenuation: true,
      map:             circleTex,
      transparent:     true,
      alphaTest:       0.001,
      opacity:         0.55,
    });

    scene.add(new THREE.Points(pGeo, pMat));
    particleState = { pGeo, pOrigins, pPhases, pFreqs, pAmps, P, circleTex, pMat };
  }

  // ── Trees ─────────────────────────────────────────────────────────────────
  const treeInstances = [
    [  26,  -5, -25, 2.3, 0 ],
    [   9, -45, -15, 4.3, 0 ],
    [  -4, -15, -25, 2.7, 0 ],
    [  -9, -15, -20, 2.0, 0 ],
    [ -13,  -5, -10, 2.0, 0 ],
  ];
  new OBJLoader().load('/MapleTreeStem.obj', (template) => {
    template.traverse((child) => { if (child.isMesh) child.material = mat; });
    for (const [x, y, z, scale, rotY] of treeInstances) {
      const obj = template.clone();
      obj.position.set(x, y, z);
      obj.scale.setScalar(scale);
      obj.rotation.y = rotY;
      scene.add(obj);
    }
  });


  // ── Sansevieria leaves ────────────────────────────────────────────────────
  const leaves = LEAF_DEFS.map((def) => {
    const geo = buildLeafGeometry(def.height, def.baseW);
    const posBackup = new Float32Array(geo.attributes.position.array);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    return { geo, posBackup, mesh, ...def };
  });

  // ── Curve visualisation lines ─────────────────────────────────────────────
  const CURVE_PTS = 24;
  const curveMat = new THREE.LineBasicMaterial({ color: 0xffffff, fog: false });
  const curveLines = leaves.map(() => {
    const positions = new Float32Array(CURVE_PTS * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const line = new THREE.Line(geo, curveMat);
    scene.add(line);
    return { geo };
  });

  // ── Mouse / touch lean ────────────────────────────────────────────────────
  let leanXTarget  = 0, leanXCurrent  = 0;
  let leanYTarget  = 0, leanYCurrent  = 0;

  function onPointerMove(e) {
    const src = e.touches ? e.touches[0] : e;
    leanXTarget = (src.clientX / window.innerWidth)  * 2 - 1;
    leanYTarget = (src.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener('mousemove',  onPointerMove, { passive: true });
  window.addEventListener('touchmove',  onPointerMove, { passive: true });
  window.addEventListener('touchstart', onPointerMove, { passive: true });

  function updateLeaves(leanX, leanY) {
    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i];
      leaf.geo.attributes.position.array.set(leaf.posBackup);
      const { curve, orientation } = buildLeafCurve(leaf, leanX, leanY);
      flexy.bend({ THREE, curve, bufferGeometry: leaf.geo, axis: 'y', orientation, mode: 'fit' });

      // Update curve line
      const pts = curve.getPoints(CURVE_PTS - 1);
      const pos = curveLines[i].geo.attributes.position.array;
      for (let j = 0; j < pts.length; j++) {
        pos[j * 3]     = pts[j].x;
        pos[j * 3 + 1] = pts[j].y;
        pos[j * 3 + 2] = pts[j].z;
      }
      curveLines[i].geo.attributes.position.needsUpdate = true;
    }
  }

  // Initial bend (centred)
  updateLeaves(0, 0);

  // ── Animation loop (throttled to ~30 fps) ─────────────────────────────────
  let rafId, lastFrame = 0, frameCount = 0;
  const FRAME_MS = 1000 / 30;

  function tick(t) {
    rafId = requestAnimationFrame(tick);
    if (t - lastFrame < FRAME_MS) return;
    lastFrame = t;
    frameCount++;

    const time = t * 0.001;
    grassMat.uniforms.uTime.value = time;

    // Smooth lean toward pointer
    leanXCurrent += (leanXTarget - leanXCurrent) * 0.04;
    leanYCurrent += (leanYTarget - leanYCurrent) * 0.04;

    // Update leaves every 3rd frame
    if (frameCount % 3 === 0) {
      updateLeaves(leanXCurrent, leanYCurrent);
    }

    // Particles
    if (particleState) {
      const { pGeo, pOrigins, pPhases, pFreqs, pAmps, P } = particleState;
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < P; i++) {
        pos[i*3]   = pOrigins[i*3]   + Math.sin(time * pFreqs[i*3]   + pPhases[i*3])   * pAmps[i*3];
        pos[i*3+1] = pOrigins[i*3+1] + Math.sin(time * pFreqs[i*3+1] + pPhases[i*3+1]) * pAmps[i*3+1];
        pos[i*3+2] = pOrigins[i*3+2] + Math.sin(time * pFreqs[i*3+2] + pPhases[i*3+2]) * pAmps[i*3+2];
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(tick);

  // ── Resize ─────────────────────────────────────────────────────────────────
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // ── Dispose ────────────────────────────────────────────────────────────────
  return function dispose() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize',     onResize);
    window.removeEventListener('mousemove',  onPointerMove);
    window.removeEventListener('touchmove',  onPointerMove);
    window.removeEventListener('touchstart', onPointerMove);
    for (const leaf of leaves) leaf.geo.dispose();
    for (const cl of curveLines) cl.geo.dispose();
    curveMat.dispose();
    if (particleState) {
      particleState.pGeo.dispose();
      particleState.pMat.dispose();
      particleState.circleTex.dispose();
    }
    renderer.dispose();
  };
}
