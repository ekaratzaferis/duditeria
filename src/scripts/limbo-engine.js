import * as THREE from 'three';
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

export function initLimboEngine(canvas) {
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
  const mat = new THREE.MeshBasicMaterial({ color: 0x000000 });

  // ── Ground ────────────────────────────────────────────────────────────────
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), mat);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // ── Trees (OBJ) ────────────────────────────────────────────────────────────
  // Load once, clone for each placement — avoids re-parsing the 4 MB OBJ 5×.
  const treeInstances = [
    // [x, y, z, scale, rotY]
    [  26,  -5, -25, 2.3, 0 ],
    [   9, -45, -15, 4.3, 0 ],
    [  -4, -15, -25, 2.7, 0 ],
    [  -9, -15, -20, 2.0, 0 ],
    [ -13,  -5, -10, 2.0, 0 ],
  ];
  new OBJLoader().load('/MapleTreeStem.obj', (template) => {
    template.traverse((child) => {
      if (child.isMesh) child.material = mat;
    });
    for (const [x, y, z, scale, rotY] of treeInstances) {
      const obj = template.clone();
      obj.position.set(x, y, z);
      obj.scale.setScalar(scale);
      obj.rotation.y = rotY;
      scene.add(obj);
    }
  });

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
  scene.add(grassMesh);

  // ── Particles ─────────────────────────────────────────────────────────────
  // Slow-drifting dust motes scattered through the scene depth.
  // Flip SHOW_PARTICLES at the top of the file to disable.
  let particleState = null;
  if (SHOW_PARTICLES) {
    const P = 650;
    const pOrigins = new Float32Array(P * 3);
    const pPhases  = new Float32Array(P * 3);
    const pFreqs   = new Float32Array(P * 3); // rad/s
    const pAmps    = new Float32Array(P * 3); // world units
    const pPos     = new Float32Array(P * 3);

    for (let i = 0; i < P; i++) {
      // Scatter across the scene volume: x ±14, y 0.2–7, z -20 to 9
      const x = (Math.random() - 0.5) * 20;
      const y = 0.2 + Math.random() * 5.0;
      const z = -4 + Math.random() * 15;
      pOrigins[i*3] = x; pOrigins[i*3+1] = y; pOrigins[i*3+2] = z;
      pPos[i*3]     = x; pPos[i*3+1]     = y; pPos[i*3+2]     = z;
      for (let a = 0; a < 3; a++) {
        pPhases[i*3+a] = Math.random() * Math.PI * 2;
        pFreqs[i*3+a]  = 0.15 + Math.random() * 0.25;  // ~4–20 s period
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

  // ── Animation loop (throttled to ~30 fps) ─────────────────────────────────
  let rafId, lastFrame = 0;
  const FRAME_MS = 1000 / 30;
  function tick(t) {
    rafId = requestAnimationFrame(tick);
    if (t - lastFrame < FRAME_MS) return;
    lastFrame = t;
    const time = t * 0.001;
    grassMat.uniforms.uTime.value = time;

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
    window.removeEventListener('resize', onResize);
    if (particleState) {
      particleState.pGeo.dispose();
      particleState.pMat.dispose();
      particleState.circleTex.dispose();
    }
    renderer.dispose();
  };
}
