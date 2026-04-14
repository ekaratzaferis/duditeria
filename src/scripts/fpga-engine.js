import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

function centreAndScale(obj, targetSize) {
  // First pass: measure pre-scale bounds
  let box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  box.getSize(size);
  const s = targetSize / Math.max(size.x, size.y, size.z);
  obj.scale.setScalar(s);
  // Second pass: measure post-scale bounds and zero the centre
  box = new THREE.Box3().setFromObject(obj);
  const centre = new THREE.Vector3();
  box.getCenter(centre);
  obj.position.sub(centre);
  // After this call, the object's visual centre is at world (0,0,0)
}

// Call after centreAndScale + any rotations.
// Lifts the object so its bottom sits at y=0, then translates to (x, z).
function placeOnFloor(obj, x, z) {
  const box = new THREE.Box3().setFromObject(obj);
  obj.position.y -= box.min.y;
  obj.position.x += x;
  obj.position.z += z;
}

function makeCircleTex(size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const h = size / 2;
  const g = ctx.createRadialGradient(h, h, 0, h, h, h);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.7)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function makeCloudTex(size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const h = size / 2;
  const g = ctx.createRadialGradient(h * 0.6, h * 0.6, 0, h, h, h);
  g.addColorStop(0,   'rgba(220,230,255,0.55)');
  g.addColorStop(0.45,'rgba(195,210,245,0.2)');
  g.addColorStop(1,   'rgba(170,195,235,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

// ─── engine ───────────────────────────────────────────────────────────────────

export function initFpgaEngine(canvas) {
  const toDispose = [];
  const loader    = new OBJLoader();

  // ── renderer ─────────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping      = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.8;

  // ── scene ─────────────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  const BG    = 0x122212;
  scene.background = new THREE.Color(BG);
  scene.fog        = new THREE.FogExp2(BG, 0.055);

  // ── camera ────────────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(
    52, window.innerWidth / window.innerHeight, 0.1, 120,
  );
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    camera.position.set(8.93, 4.76, 8.94);
    camera.lookAt(0.28, 0.19, -0.73);
  } else {
    camera.position.set(1.85, 8.53, 9.25);
    camera.lookAt(-0.50, 0.49, -0.29);
  }

  // ── lights ────────────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x2a402a, 8.0));

  const keyLight = new THREE.DirectionalLight(0xffeedd, 2.0);
  keyLight.position.set(2, 14, 6);
  scene.add(keyLight);

  // Monitor blue-white glow
  const monLight = new THREE.PointLight(0x4477ff, 6.0, 13);
  monLight.position.set(3.2, 1.1, 1.6);  // updated below after monitor is built
  scene.add(monLight);

  // FPGA warm gold glow
  const fpgaLight = new THREE.PointLight(0xd4a017, 3.0, 10);
  fpgaLight.position.set(-1.0, 0.6, 0.5);
  scene.add(fpgaLight);

  // Peripheral fill light (warm white, covers monitor+keyboard+mouse cluster)
  const periLight = new THREE.PointLight(0xfff0dd, 3.5, 10);
  periLight.position.set(3.8, 3.0, 1.5);
  scene.add(periLight);

  // ══════════════════════════════════════════════════
  // PCB BOARD
  // ══════════════════════════════════════════════════

  // No board mesh — background colour doubles as the PCB surface

  // ══════════════════════════════════════════════════
  // GOLDEN TRACES
  // ══════════════════════════════════════════════════

  const goldMat = new THREE.MeshStandardMaterial({
    color:    0xd4a827,
    emissive: 0xb88a10,
    emissiveIntensity: 0.55,
    metalness: 0.95,
    roughness: 0.06,
  });
  toDispose.push(goldMat);

  const TY = 0.09;  // trace Y (just above board)
  const TH = 0.035; // trace height
  const TW = 0.05;  // trace width

  // Via pad
  const viaGeo = new THREE.CylinderGeometry(0.10, 0.10, TH * 1.5, 14);
  toDispose.push(viaGeo);

  function via(x, z) {
    const m = new THREE.Mesh(viaGeo, goldMat);
    m.position.set(x, TY + TH * 0.1, z);
    scene.add(m);
  }

  // Straight trace segment (flat box between two 2D points)
  function seg(x1, z1, x2, z2, w = TW) {
    const dx = x2 - x1, dz = z2 - z1;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.005) return;
    const geo = new THREE.BoxGeometry(w, TH, len);
    const m   = new THREE.Mesh(geo, goldMat);
    m.position.set((x1 + x2) * 0.5, TY, (z1 + z2) * 0.5);
    m.rotation.y = Math.atan2(dx, dz);
    scene.add(m);
    toDispose.push(geo);
  }

  // ── key positions ─────────────────────────────────
  const FX = -1.0,  FZ = 0.5;   // FPGA
  const SX = -5.5,  SZ = -4.5;  // server projected to PCB
  const MX =  3,  MZ =  0;  // monitor (next to keyboard/mouse)
  const KX =  2.8,  KZ = 1.8;   // keyboard
  const MSX = 4.5,  MSZ = 1.5;  // mouse

  // ── Bundle A: Server → FPGA (5 parallel traces)
  // Route: horizontal (X-axis) to turn, then vertical (Z-axis) to FPGA
  // Traces offset in Z for horizontal leg; offset in X for vertical leg
  {
    const N = 5;
    for (let i = 0; i < N; i++) {
      const zo = (i - (N - 1) / 2) * 0.13; // Z-offset for horizontal leg
      const xo = (i - (N - 1) / 2) * 0.13; // X-offset for vertical leg
      // Horizontal: server → turn column (at FX + xo)
      seg(SX, SZ + zo, FX + xo, SZ + zo, TW);
      // Vertical: turn row (at SZ + zo) → FPGA
      seg(FX + xo, SZ + zo, FX + xo, FZ, TW);
      // Corner via
      via(FX + xo, SZ + zo);
      // Start via
      via(SX, SZ + zo);
    }
    // End vias at FPGA
    for (let i = 0; i < N; i++) {
      const xo = (i - (N - 1) / 2) * 0.13;
      via(FX + xo, FZ);
    }
  }

  // ── Bundle B: FPGA → Monitor (3 parallel traces, L-shaped)
  {
    const N = 3;
    const turnX = MX;
    for (let i = 0; i < N; i++) {
      const zo = (i - (N - 1) / 2) * 0.13;
      // Horizontal from FPGA right side at MZ height
      seg(FX + 0.95, MZ + zo, turnX, MZ + zo, TW);
      via(FX + 0.95, MZ + zo);
      via(turnX, MZ + zo);
    }
  }

  // ── Bundle C: FPGA → Keyboard (3 parallel traces, L-shaped)
  {
    const N = 3;
    const turnZ = FZ + 0.9;
    for (let i = 0; i < N; i++) {
      const xo = (i - (N - 1) / 2) * 0.13;
      seg(FX + 0.95 + xo, turnZ, KX + xo, turnZ, TW);
      seg(KX + xo, turnZ, KX + xo, KZ, TW);
      via(KX + xo, turnZ);
      via(KX + xo, KZ);
    }
  }

  // ── Bundle D: FPGA → Mouse (2 parallel traces, L-shaped)
  {
    const N = 2;
    const turnZ = FZ + 0.3;
    for (let i = 0; i < N; i++) {
      const xo = i * 0.13;
      seg(FX + 0.95, turnZ + xo, MSX, turnZ + xo, TW);
      seg(MSX, turnZ + xo, MSX, MSZ, TW);
      via(MSX, turnZ + xo);
      via(MSX, MSZ);
    }
  }

  // ── Decorative traces (scattered on board for realism)
  const decTraces = [
    [-8, -2, -5, -2], [-5, -2, -5, 0.5],
    [7, -4, 7, -1],   [7, -1, 9.5, -1],
    [-7, 5,  -4, 5],  [-4, 5, -4, 3],
    [3, -6,  7, -6],  [7, -6, 7, -3],
    [-9, 1,  -9, -3], [1.5, -5.5, 4, -5.5],
    [8, 4,  8, 6],    [5, 6, 8, 6],
    [-6, -7, -2, -7], [-2, -7, -2, -5],
    [9, 2,  6, 2],    [3.5, -8, 3.5, -6],
  ];
  for (const [x1, z1, x2, z2] of decTraces) {
    seg(x1, z1, x2, z2, 0.04);
    via(x1, z1); via(x2, z2);
  }

  // ══════════════════════════════════════════════════
  // FPGA CHIP
  // ══════════════════════════════════════════════════

  const chipMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c1c, roughness: 0.55, metalness: 0.45,
  });
  toDispose.push(chipMat);

  const chipGeo = new THREE.BoxGeometry(1.8, 0.14, 1.8);
  const chipMesh = new THREE.Mesh(chipGeo, chipMat);
  chipMesh.position.set(FX, TY + 0.07, FZ);
  scene.add(chipMesh);
  toDispose.push(chipGeo);

  // Chip edges outline
  const chipEdgeMat = new THREE.LineBasicMaterial({ color: 0x3a3a3a });
  const chipEdges   = new THREE.EdgesGeometry(chipGeo);
  const chipLines   = new THREE.LineSegments(chipEdges, chipEdgeMat);
  chipLines.position.copy(chipMesh.position);
  scene.add(chipLines);
  toDispose.push(chipEdgeMat, chipEdges);

  // IC pins (TQFP style)
  const pinGeo = new THREE.BoxGeometry(0.055, 0.04, 0.11);
  const pinMat = new THREE.MeshStandardMaterial({
    color: 0xd4aa20, emissive: 0xb08800, emissiveIntensity: 0.3,
    metalness: 0.9, roughness: 0.07,
  });
  toDispose.push(pinGeo, pinMat);

  const PIN_N  = 10;
  const PIN_SP = 1.5;
  const HALF   = 1.8 / 2 + 0.08;
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < PIN_N; i++) {
      const t = (i / (PIN_N - 1) - 0.5) * PIN_SP;
      const pin = new THREE.Mesh(pinGeo, pinMat);
      if (side === 0) { pin.position.set(FX + t, TY + 0.05, FZ - HALF); }
      else if (side === 1) { pin.position.set(FX + t, TY + 0.05, FZ + HALF); }
      else if (side === 2) { pin.position.set(FX - HALF, TY + 0.05, FZ + t); pin.rotation.y = Math.PI / 2; }
      else                 { pin.position.set(FX + HALF, TY + 0.05, FZ + t); pin.rotation.y = Math.PI / 2; }
      scene.add(pin);
    }
  }

  // Chip mark dot
  const markGeo = new THREE.CircleGeometry(0.07, 12);
  const markMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mark = new THREE.Mesh(markGeo, markMat);
  mark.rotation.x = -Math.PI / 2;
  mark.position.set(FX - 0.62, TY + 0.16, FZ - 0.62);
  scene.add(mark);
  toDispose.push(markGeo, markMat);

  // ══════════════════════════════════════════════════
  // SIGNAL PULSES (animated gold sparks along traces)
  // ══════════════════════════════════════════════════

  const tracePathDefs = [
    // A: server → FPGA
    [
      new THREE.Vector3(SX, TY, SZ),
      new THREE.Vector3(FX, TY, SZ),
      new THREE.Vector3(FX, TY, FZ),
    ],
    // A reverse: FPGA → server
    [
      new THREE.Vector3(FX, TY, FZ),
      new THREE.Vector3(FX, TY, SZ),
      new THREE.Vector3(SX, TY, SZ),
    ],
    // B: FPGA → monitor
    [
      new THREE.Vector3(FX + 0.95, TY, MZ),
      new THREE.Vector3(MX, TY, MZ),
    ],
    // B reverse
    [
      new THREE.Vector3(MX, TY, MZ),
      new THREE.Vector3(FX + 0.95, TY, MZ),
    ],
    // C: FPGA → keyboard
    [
      new THREE.Vector3(FX + 0.95, TY, FZ + 0.9),
      new THREE.Vector3(KX, TY, FZ + 0.9),
      new THREE.Vector3(KX, TY, KZ),
    ],
    // D: FPGA → mouse
    [
      new THREE.Vector3(FX + 0.95, TY, FZ + 0.3),
      new THREE.Vector3(MSX, TY, FZ + 0.3),
      new THREE.Vector3(MSX, TY, MSZ),
    ],
  ];

  function polyPos(pts, t) {
    t = Math.max(0, Math.min(1 - 1e-9, t));
    const n = pts.length - 1;
    const s = t * n;
    const i = Math.floor(s);
    return new THREE.Vector3().lerpVectors(pts[i], pts[i + 1], s - i);
  }

  const pulseGeo = new THREE.SphereGeometry(0.11, 8, 8);
  const pulseMat = new THREE.MeshBasicMaterial({
    color: 0xffe04a,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  toDispose.push(pulseGeo, pulseMat);

  const pulses = Array.from({ length: 8 }, (_, i) => {
    const mesh = new THREE.Mesh(pulseGeo, pulseMat);
    mesh.visible = false;
    scene.add(mesh);
    return {
      mesh,
      path:  i % tracePathDefs.length,
      t:     i / 8,
      speed: 0.22 + Math.random() * 0.18,
    };
  });

  // ══════════════════════════════════════════════════
  // CLOUD / FOG PARTICLES around server
  // ══════════════════════════════════════════════════

  const cloudTex = makeCloudTex(128);
  toDispose.push(cloudTex);

  const cloudMat = new THREE.MeshBasicMaterial({
    map: cloudTex, transparent: true, opacity: 0.32,
    depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
  });
  toDispose.push(cloudMat);

  const SRV3 = new THREE.Vector3(-5.2, 2.5, -4.5);  // centroid of server row

  const clouds = Array.from({ length: 38 }, () => {
    const sz  = 2.2 + Math.random() * 3.8;
    const geo = new THREE.PlaneGeometry(sz, sz);
    const m   = new THREE.Mesh(geo, cloudMat);
    m.position.set(
      SRV3.x + (Math.random() - 0.5) * 9.0,
      SRV3.y + (Math.random() - 0.5) * 4.0,
      SRV3.z + (Math.random() - 0.5) * 8.0,
    );
    m.rotation.set(
      (Math.random() - 0.5) * 0.5,
      Math.random() * Math.PI * 2,
      (Math.random() - 0.5) * 0.5,
    );
    m.userData.ry   = (Math.random() - 0.5) * 0.004;
    m.userData.dy   = Math.random() * 0.004;
    m.userData.dph  = Math.random() * Math.PI * 2;
    scene.add(m);
    toDispose.push(geo);
    return m;
  });

  // ══════════════════════════════════════════════════
  // MONITOR (procedural — body + stand + glowing screen)
  // ══════════════════════════════════════════════════
  //
  // Tweak these three numbers to reposition the whole monitor:
  const MON_X  = MX;   // left / right
  const MON_Z  = MZ;   // near (positive) / far (negative)
  const MON_Y  = 0;    // lift off floor (0 = sitting on floor)

  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, roughness: 0.55, metalness: 0.55,
  });
  toDispose.push(bezelMat);

  const monitorGroup = new THREE.Group();

  // Base plate
  const mBaseGeo = new THREE.BoxGeometry(0.85, 0.07, 0.42);
  monitorGroup.add(new THREE.Mesh(mBaseGeo, bezelMat));
  toDispose.push(mBaseGeo);

  // Neck / stand column
  const mNeckGeo = new THREE.BoxGeometry(0.13, 0.38, 0.11);
  const mNeck = new THREE.Mesh(mNeckGeo, bezelMat);
  mNeck.position.set(0, 0.035 + 0.19, 0);  // base_half + neck_half
  monitorGroup.add(mNeck);
  toDispose.push(mNeckGeo);

  // Monitor body (bezel frame)
  const BODY_W = 2.0, BODY_H = 1.28, BODY_D = 0.11;
  const BODY_Y = 0.035 + 0.38 + BODY_H / 2;  // rests on neck top
  const mBodyGeo = new THREE.BoxGeometry(BODY_W, BODY_H, BODY_D);
  const mBody = new THREE.Mesh(mBodyGeo, bezelMat);
  mBody.position.set(0, BODY_Y, 0);
  monitorGroup.add(mBody);
  toDispose.push(mBodyGeo);

  // Screen panel — inset inside bezel, on the front face
  const BEZEL = 0.08;  // bezel width
  const SCR_W = BODY_W - BEZEL * 2;
  const SCR_H = BODY_H - BEZEL * 2;
  const scrMat = new THREE.MeshStandardMaterial({
    color:    0x1a44cc,
    emissive: 0x2255ee,
    emissiveIntensity: 2.8,
    roughness: 0.05,
    metalness: 0.0,
  });
  toDispose.push(scrMat);
  const scrGeo = new THREE.PlaneGeometry(SCR_W, SCR_H);
  const scrMesh = new THREE.Mesh(scrGeo, scrMat);
  scrMesh.position.set(0, BODY_Y, BODY_D / 2 + 0.001);  // just proud of front face
  monitorGroup.add(scrMesh);
  toDispose.push(scrGeo);

  monitorGroup.position.set(MON_X, MON_Y, MON_Z);
  monitorGroup.rotation.y = -Math.PI * 0.05;
  scene.add(monitorGroup);
  // Snap light to actual monitor position
  monLight.position.set(MON_X, BODY_Y, MON_Z + 0.8);

  // ══════════════════════════════════════════════════
  // 3D MODEL MATERIALS
  // ══════════════════════════════════════════════════

  const serverMat = new THREE.MeshStandardMaterial({
    color: 0x303030, roughness: 0.50, metalness: 0.80,
  });
  const periMat = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a, roughness: 0.55, metalness: 0.70,
  });
  toDispose.push(serverMat, periMat);

  function applyMat(obj, mat) {
    obj.traverse(m => {
      if (m.isMesh) { m.material = mat; m.castShadow = false; }
    });
  }

  // Server array — 3 units in a straight row, standing on their short side
  const srvXs = [-7.0, -5.2, -3.4];
  const SRV_Z = -4.5;
  for (const sx of srvXs) {
    loader.load('/server.obj', obj => {
      applyMat(obj, serverMat);
      centreAndScale(obj, 2.4);
      obj.rotation.x = -Math.PI / 2;   // stand upright
      obj.rotation.y =  0;             // no compound tilt
      placeOnFloor(obj, sx, SRV_Z);
      scene.add(obj);
    });
  }


  // Keyboard
  loader.load('/keyboard.obj', obj => {
    applyMat(obj, periMat);
    centreAndScale(obj, 2.0);
    obj.rotation.y = Math.PI * 0.04;
    placeOnFloor(obj, KX, KZ);
    scene.add(obj);
    // Re-centre periLight between actual keyboard and mouse positions
    periLight.position.set(obj.position.x + 0.8, 3.0, obj.position.z + 0.2);
  });

  // Mouse
  loader.load('/mouse.obj', obj => {
    applyMat(obj, periMat);
    centreAndScale(obj, 0.55);
    obj.rotation.y = -Math.PI * 0.12;
    placeOnFloor(obj, MSX, MSZ);
    scene.add(obj);
  });

  // ══════════════════════════════════════════════════
  // SCATTERED IC CHIPS (board detail)
  // ══════════════════════════════════════════════════

  const smallChipMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, roughness: 0.6, metalness: 0.4,
  });
  toDispose.push(smallChipMat);

  const icPositions = [
    // left side cluster
    [-7.5, -2,  0.80, 0.50], [-8.0,  3.5, 0.50, 0.40],
    [-9.0, -4,  0.80, 0.50], [-9.5,  0.5, 0.55, 0.38],
    [-7.0,  5.5,0.65, 0.42], [-6.0, -7,   0.50, 0.35],
    [-4.5,  7,  0.70, 0.45], [-3.5, -6.5, 0.55, 0.38],
    [-2.0,  8,  0.48, 0.32], [-8.5, -6,   0.60, 0.40],
    // right side cluster
    [ 6.5, -4,  0.60, 0.40], [ 8.5,  2.5, 0.90, 0.55],
    [ 7.0,  5.5,0.60, 0.40], [ 5.0, -6,   0.50, 0.32],
    [ 9.5, -2,  0.55, 0.38], [ 7.5, -7,   0.70, 0.45],
    [ 9.0,  4.5,0.50, 0.35], [ 4.0, -7.5, 0.65, 0.42],
    [ 6.5, -7.5,0.45, 0.30], [ 0.5, -8.5, 0.55, 0.38],
    // top / bottom edge
    [-5.0,  8,  0.60, 0.38], [-1.5,  8.5, 0.50, 0.32],
    [ 2.5,  7.5,0.65, 0.40], [ 5.5,  7.5, 0.50, 0.35],
    [-6.5, -8,  0.55, 0.36], [ 3.0, -8.5, 0.60, 0.40],
    // mid-board extras
    [-4.0, -1.5,0.45, 0.30], [ 1.5,  3.5, 0.42, 0.28],
    [ 6.0,  2.0,0.50, 0.32],
  ];
  for (const [x, z, w, d] of icPositions) {
    const geo = new THREE.BoxGeometry(w, 0.09, d);
    const m   = new THREE.Mesh(geo, smallChipMat);
    m.position.set(x, TY + 0.045, z);
    m.rotation.y = (Math.random() - 0.5) * Math.PI * 0.5;
    scene.add(m);
    toDispose.push(geo);
  }

  // Random decorative vias
  const rndVias = [
    [-7,-1],[-7,1],[-8,4],[7,-3],[8.5,1],[3,-5],[-3,6],[7.5,5],
    [-6.5,5.5],[2,-7.5],[-2,7.5],[9.5,0],[-9.5,2],[4,-7.5],[-4,7.5],
    [1,-9],[6.5,-2.5],[0.5,-9],[-5,8],[5,-8],
  ];
  for (const [x, z] of rndVias) via(x, z);

  // ══════════════════════════════════════════════════
  // ATMOSPHERIC DUST
  // ══════════════════════════════════════════════════

  const DUST = 160;
  const dPos  = new Float32Array(DUST * 3);
  const dOrig = new Float32Array(DUST * 3);
  const dPh   = new Float32Array(DUST * 3);
  const dFr   = new Float32Array(DUST * 3);
  const dAm   = new Float32Array(DUST * 3);

  for (let i = 0; i < DUST; i++) {
    const x = (Math.random() - 0.5) * 22;
    const y = 0.3 + Math.random() * 7;
    const z = (Math.random() - 0.5) * 17;
    dOrig[i*3]=x; dOrig[i*3+1]=y; dOrig[i*3+2]=z;
    dPos[i*3]=x;  dPos[i*3+1]=y;  dPos[i*3+2]=z;
    for (let a = 0; a < 3; a++) {
      dPh[i*3+a] = Math.random() * Math.PI * 2;
      dFr[i*3+a] = 0.04 + Math.random() * 0.16;
      dAm[i*3+a] = 0.04 + Math.random() * 0.10;
    }
  }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  const circleTex = makeCircleTex();
  const dMat = new THREE.PointsMaterial({
    color: 0x3a5a3a, size: 0.04, sizeAttenuation: true,
    map: circleTex, transparent: true, alphaTest: 0.001, opacity: 0.55,
  });
  scene.add(new THREE.Points(dGeo, dMat));
  toDispose.push(dGeo, dMat, circleTex);

  // ══════════════════════════════════════════════════
  // ANIMATION LOOP
  // ══════════════════════════════════════════════════

  let rafId, lastTime = 0;

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min((now - lastTime) * 0.001, 0.05);
    lastTime = now;
    if (dt <= 0) return;
    const t = now * 0.001;

    // Cloud planes drift & rotate
    for (const c of clouds) {
      c.rotation.y += c.userData.ry;
      c.position.y += Math.sin(t * c.userData.dy + c.userData.dph) * 0.0006;
    }

    // Signal pulses travel along traces
    for (const p of pulses) {
      p.t += p.speed * dt;
      if (p.t >= 1.0) {
        p.t -= 1.0;
        p.path = (p.path + 1) % tracePathDefs.length;
      }
      const pos = polyPos(tracePathDefs[p.path], p.t);
      p.mesh.position.copy(pos);
      p.mesh.visible = true;
      const edge = 0.08;
      const fade = Math.min(p.t / edge, (1 - p.t) / edge, 1);
      const pulse = 0.6 + Math.sin(t * 9 + p.path * 1.3) * 0.25;
      p.mesh.scale.setScalar(pulse * fade);
    }

    // Pulsing lights
    fpgaLight.intensity = 2.5 + Math.sin(t * 3.2) * 0.6;
    monLight.intensity  = 4.0 + Math.sin(t * 1.8) * 0.4;

    // Animated dust
    for (let i = 0; i < DUST; i++) {
      dPos[i*3]   = dOrig[i*3]   + Math.sin(t * dFr[i*3]   + dPh[i*3])   * dAm[i*3];
      dPos[i*3+1] = dOrig[i*3+1] + Math.sin(t * dFr[i*3+1] + dPh[i*3+1]) * dAm[i*3+1];
      dPos[i*3+2] = dOrig[i*3+2] + Math.sin(t * dFr[i*3+2] + dPh[i*3+2]) * dAm[i*3+2];
    }
    dGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  rafId = requestAnimationFrame(t0 => { lastTime = t0; rafId = requestAnimationFrame(tick); });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  return function dispose() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    for (const o of toDispose) o.dispose();
    renderer.dispose();
  };
}
