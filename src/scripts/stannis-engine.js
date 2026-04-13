import * as THREE from 'three';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCircleTexture(size = 64) {
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

function v3(x, y, z) { return new THREE.Vector3(x, y, z); }

function polyLen(pts) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += pts[i - 1].distanceTo(pts[i]);
  return l;
}

function polyPos(pts, t) {
  t = Math.max(0, Math.min(1 - 1e-9, t));
  const n = pts.length - 1;
  const s = t * n;
  const i = Math.floor(s);
  return new THREE.Vector3().lerpVectors(pts[i], pts[i + 1], s - i);
}

// ─── Layout ───────────────────────────────────────────────────────────────────
// X = rightward flow, Z = depth branching, Y = up
// Workflow spans X: -11 (start) → 12 (exit)

const GY = 0.16; // box ride height

const P = {
  start:    v3(-11, GY, 0),
  entry:    v3(-9,  GY, 0),
  split:    v3(-7,  GY, 0),
  // Sequence 1 row (z = -2.8): 3 task nodes
  s1in:     v3(-6.2, GY, -2.8),
  s1a:      v3(-5.0, GY, -2.8),
  s1b:      v3(-3.8, GY, -2.8),
  s1c:      v3(-2.6, GY, -2.8),
  s1out:    v3(-1.6, GY, -2.8),
  // Sequence 2 row (z = 2.8): 2 task nodes
  s2in:     v3(-6.2, GY,  2.8),
  s2a:      v3(-5.0, GY,  2.8),
  s2b:      v3(-3.8, GY,  2.8),
  s2out:    v3(-1.6, GY,  2.8),
  // Post-merge
  merge:    v3(-0.4, GY, 0),
  joinTask: v3(1.2,  GY, 0),
  dec1:     v3(3.0,  GY, 0),
  // Top branch
  topTask:  v3(5.0,  GY, -2.8),
  race:     v3(7.2,  GY, -2.8),
  // Bottom branch
  botTask:  v3(5.0,  GY,  2.8),
  // Final decision / exit
  dec2:     v3(9.5,  GY, 0),
  exit:     v3(12.0, GY, 0),
};

// ─── Path graph ───────────────────────────────────────────────────────────────
// nodeType at END of path; drives box behavior when it arrives there.

const SPEED = 2.4; // world units / second for data boxes

function makePaths() {
  const defs = {
    start: {
      pts: [v3(-12, GY, 0), P.start, P.entry],
      nodeType: 'task',
      next: ['entryToSplit'],
    },
    entryToSplit: {
      pts: [P.entry, P.split],
      nodeType: 'split',
      next: ['seq1enter', 'seq2enter'],
    },
    // ── Sequence 1 ─────────────────────────────────────────────────────────
    seq1enter: {
      pts: [P.split, v3(-7, GY, -1.4), P.s1in, P.s1a],
      nodeType: 'task', next: ['seq1mid'],
    },
    seq1mid: {
      pts: [P.s1a, P.s1b],
      nodeType: 'task', next: ['seq1end'],
    },
    seq1end: {
      pts: [P.s1b, P.s1c],
      nodeType: 'task', next: ['seq1exit'],
    },
    seq1exit: {
      pts: [P.s1c, P.s1out, v3(-1, GY, -1.4), P.merge],
      nodeType: null, next: ['mergeTask'],
    },
    // ── Sequence 2 ─────────────────────────────────────────────────────────
    seq2enter: {
      pts: [P.split, v3(-7, GY, 1.4), P.s2in, P.s2a],
      nodeType: 'task', next: ['seq2mid'],
    },
    seq2mid: {
      pts: [P.s2a, P.s2b],
      nodeType: 'task', next: ['seq2exit'],
    },
    seq2exit: {
      pts: [P.s2b, P.s2out, v3(-1, GY, 1.4), P.merge],
      nodeType: null, next: ['mergeTask'],
    },
    // ── After merge ─────────────────────────────────────────────────────────
    mergeTask: {
      pts: [P.merge, P.joinTask],
      nodeType: 'task', next: ['toDec1'],
    },
    toDec1: {
      pts: [P.joinTask, P.dec1],
      nodeType: 'decision',
      next: ['dec1top', 'dec1bot'],
    },
    // ── Top branch ──────────────────────────────────────────────────────────
    dec1top: {
      pts: [P.dec1, v3(4.0, GY, -1.4), P.topTask],
      nodeType: 'task', next: ['toRace'],
    },
    toRace: {
      pts: [P.topTask, P.race],
      nodeType: 'race', next: ['raceToDec2'],
    },
    raceToDec2: {
      pts: [P.race, v3(8.5, GY, -1.4), P.dec2],
      nodeType: 'decision-merge', next: ['toExit'],
    },
    // ── Bottom branch ────────────────────────────────────────────────────────
    dec1bot: {
      pts: [P.dec1, v3(4.0, GY, 1.4), P.botTask],
      nodeType: 'task', next: ['botToDec2'],
    },
    botToDec2: {
      pts: [P.botTask, v3(7.5, GY, 1.4), v3(8.5, GY, 1.4), P.dec2],
      nodeType: 'decision-merge', next: ['toExit'],
    },
    // ── Exit ─────────────────────────────────────────────────────────────────
    toExit: {
      pts: [P.dec2, P.exit, v3(13.5, GY, 0)],
      nodeType: null, next: [],
    },
  };

  for (const seg of Object.values(defs)) {
    seg.len    = polyLen(seg.pts);
    seg.tSpeed = SPEED / seg.len;
  }
  return defs;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export function initStannisEngine(canvas) {
  const PATHS    = makePaths();
  const toDispose = [];

  // ── Renderer ────────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ── Scene & fog ───────────────────────────────────────────────────────────
  // Limbo approach: bright grey fog IS the light source.
  // Near objects stay dark (their material colour), far objects fade to grey mist.
  const FOG_COLOR = 0xa0a0a0;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(FOG_COLOR);
  scene.fog = new THREE.FogExp2(FOG_COLOR, 0.018);

  // ── Camera — steep angle, no horizon visible ──────────────────────────────
  const camera = new THREE.PerspectiveCamera(
    62, window.innerWidth / window.innerHeight, 0.1, 80,
  );
  camera.position.set(7.29, 13.21, 6.19);
  camera.lookAt(2.60, -0.25, 0.10);

  // ── Lighting ──────────────────────────────────────────────────────────────
  // Strong ambient so dark objects still read with 3-D shading, not as blobs.
  scene.add(new THREE.AmbientLight(0xffffff, 1.4));
  // Single directional from above-front — tops and front faces get highlight.
  const sun = new THREE.DirectionalLight(0xffffff, 1.0);
  sun.position.set(4, 14, 8);
  sun.target.position.set(0, 0, 0);
  scene.add(sun, sun.target);


  // ── Conveyor belts — seamless ribbon geometry ─────────────────────────────
  const beltMat = new THREE.MeshBasicMaterial({ color: 0x3a3a3a, side: THREE.DoubleSide });
  toDispose.push(beltMat);

  function makeRibbon(pts, width, y = 0.06) {
    const n   = pts.length;
    const pos = [];
    const idx = [];

    for (let i = 0; i < n; i++) {
      // Tangent: average neighbouring segments so joints are mitered
      let dx, dz;
      if (i === 0) {
        dx = pts[1].x - pts[0].x;
        dz = pts[1].z - pts[0].z;
      } else if (i === n - 1) {
        dx = pts[n-1].x - pts[n-2].x;
        dz = pts[n-1].z - pts[n-2].z;
      } else {
        dx = pts[i+1].x - pts[i-1].x;
        dz = pts[i+1].z - pts[i-1].z;
      }
      const l = Math.sqrt(dx*dx + dz*dz) || 1;
      // Perpendicular in XZ
      const px = -dz / l, pz = dx / l;
      const hw = width / 2;
      pos.push(
        pts[i].x + px * hw, y, pts[i].z + pz * hw,
        pts[i].x - px * hw, y, pts[i].z - pz * hw,
      );
    }

    for (let i = 0; i < n - 1; i++) {
      const a = i*2, b = i*2+1, c = i*2+2, d = i*2+3;
      idx.push(a, b, c,  b, d, c);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    return geo;
  }

  // Some path pairs share a node center — render them as one continuous ribbon
  // so the miter joint is computed across the full polyline, not per-segment.
  const ribbonChains = [
    // Through the race box
    [...PATHS.toRace.pts, ...PATHS.raceToDec2.pts.slice(1)],
    // All other paths rendered individually
    ...Object.entries(PATHS)
      .filter(([id]) => !['toRace', 'raceToDec2'].includes(id))
      .map(([, seg]) => seg.pts),
  ];

  for (const pts of ribbonChains) {
    const geo  = makeRibbon(pts, 0.45);
    const mesh = new THREE.Mesh(geo, beltMat);
    scene.add(mesh);
    toDispose.push(geo);
  }

  const conveyors = [];

  // ── Materials shared by nodes ─────────────────────────────────────────────
  const solidMat = new THREE.MeshStandardMaterial({
    color: 0x181818, roughness: 0.85, metalness: 0.1,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x888888, transparent: true, opacity: 0.12,
    roughness: 0.0, metalness: 0.1,
    side: THREE.DoubleSide, depthWrite: false,
  });
  toDispose.push(solidMat, glassMat);

  // Shared edge-line material — clean outlines, no diagonal wireframe mess
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x555555 });
  toDispose.push(edgeMat);

  function addEdges(geo, position, rotation) {
    const edges = new THREE.EdgesGeometry(geo);
    const lines = new THREE.LineSegments(edges, edgeMat);
    lines.position.copy(position);
    if (rotation) lines.rotation.copy(rotation);
    scene.add(lines);
    toDispose.push(edges);
    return lines;
  }

  // ── Task disks ────────────────────────────────────────────────────────────
  const diskGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.09, 28);
  toDispose.push(diskGeo);

  const taskNodes = [
    P.entry, P.s1a, P.s1b, P.s1c, P.s2a, P.s2b,
    P.joinTask, P.topTask, P.botTask,
  ];
  for (const pos of taskNodes) {
    const m = new THREE.Mesh(diskGeo, solidMat);
    m.position.set(pos.x, 0.045, pos.z);
    scene.add(m);
    // Rim ring on top
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.03, 6, 28),
      solidMat,
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.set(pos.x, 0.09, pos.z);
    scene.add(rim);
  }

  // ── Sequence boxes — glass body + edges ──────────────────────────────────
  function makeSeqBox(cx, cz, width) {
    const pos = new THREE.Vector3(cx, 0.31, cz);
    const geo = new THREE.BoxGeometry(width, 0.62, 1.4);
    const mesh = new THREE.Mesh(geo, glassMat);
    mesh.position.copy(pos);
    scene.add(mesh);
    addEdges(geo, pos);
    toDispose.push(geo);

  }
  makeSeqBox(-3.9, -2.8, 5.2);
  makeSeqBox(-3.9,  2.8, 5.2);

  // ── Decision diamonds ─────────────────────────────────────────────────────
  function makeDiamond(pos) {
    const geo  = new THREE.OctahedronGeometry(0.62);
    const mesh = new THREE.Mesh(geo, solidMat);
    mesh.position.set(pos.x, 0.38, pos.z);
    mesh.scale.set(1, 0.5, 1);
    scene.add(mesh);
    addEdges(geo, new THREE.Vector3(pos.x, 0.38, pos.z))
      .scale.set(1, 0.5, 1);
    toDispose.push(geo);
    return mesh;
  }
  const diamond1 = makeDiamond(P.dec1);
  const diamond2 = makeDiamond(P.dec2);

  // ── Race box ──────────────────────────────────────────────────────────────
  const raceW = 2.2, raceH = 0.72, raceD = 2.4;
  const raceGeo = new THREE.BoxGeometry(raceW, raceH, raceD);
  const raceMesh = new THREE.Mesh(raceGeo, glassMat);
  raceMesh.position.set(P.race.x, 0.36, P.race.z);
  scene.add(raceMesh);
  addEdges(raceGeo, new THREE.Vector3(P.race.x, 0.36, P.race.z));
  toDispose.push(raceGeo);

  // ── Parallel nodes (split & merge) ────────────────────────────────────────
  const parGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.20, 6);
  for (const pos of [P.split, P.merge]) {
    const m = new THREE.Mesh(parGeo, glassMat);
    m.position.set(pos.x, 0.10, pos.z);
    scene.add(m);
    addEdges(parGeo, new THREE.Vector3(pos.x, 0.10, pos.z));
  }
  toDispose.push(parGeo);

  // ── Data boxes ────────────────────────────────────────────────────────────
  const BOX_POOL = 50;
  const boxGeo = new THREE.BoxGeometry(0.20, 0.20, 0.20);
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.5, metalness: 0.1,
  });
  toDispose.push(boxGeo, boxMat);

  const pool = Array.from({ length: BOX_POOL }, () => {
    const mesh = new THREE.Mesh(boxGeo, boxMat);
    mesh.visible  = false;
    mesh.castShadow = true;
    scene.add(mesh);
    return {
      mesh, active: false,
      pathId: '', t: 0,
      state: 'moving',        // 'moving' | 'anim' | 'race'
      animTimer: 0,
      animDur: 0,
      animType: 'spin',       // 'spin' | 'jump' | 'shake'
      nextPath: '',
      basePos: new THREE.Vector3(),
    };
  });

  // Race state — 3 competitor slots. Index 0 = winner (white), rest = losers (dark).
  const raceLoserMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 });
  toDispose.push(raceLoserMat);
  const raceComps = Array.from({ length: 3 }, (_, i) => {
    const m = new THREE.Mesh(boxGeo, i === 0 ? boxMat : raceLoserMat);
    m.visible = false;
    scene.add(m);
    return { mesh: m, laneZ: (i - 1) * 0.72, active: false, localX: 0, speed: 0 };
  });
  let raceTrigger = null;   // the box that triggered the race
  let raceTimer   = 0;
  let raceDone    = true;

  function getBox() { return pool.find(b => !b.active) || null; }

  function killBox(b) {
    b.active = false;
    b.mesh.visible = false;
    b.state = 'moving';
  }

  function spawnBox(pathId, t = 0) {
    const b = getBox();
    if (!b) return;
    b.active    = true;
    b.pathId    = pathId;
    b.t         = t;
    b.state     = 'moving';
    b.animTimer = 0;
    b.nextPath  = '';
    b.mesh.visible = true;
    b.mesh.rotation.set(0, 0, 0);
    b.mesh.scale.setScalar(1);
  }

  // ── Atmospheric dust ──────────────────────────────────────────────────────
  const DUST     = 220;
  const dPos     = new Float32Array(DUST * 3);
  const dOrigins = new Float32Array(DUST * 3);
  const dPhases  = new Float32Array(DUST * 3);
  const dFreqs   = new Float32Array(DUST * 3);
  const dAmps    = new Float32Array(DUST * 3);

  for (let i = 0; i < DUST; i++) {
    const x = (Math.random() - 0.5) * 14;
    const y = 10 + Math.random() * 10;  // float near camera eye (camera at y=18)
    const z = 3 + Math.random() * 7;    // camera at z=8, so z=3–10
    dOrigins[i*3]=x; dOrigins[i*3+1]=y; dOrigins[i*3+2]=z;
    dPos[i*3]=x;     dPos[i*3+1]=y;     dPos[i*3+2]=z;
    for (let a = 0; a < 3; a++) {
      dPhases[i*3+a] = Math.random() * Math.PI * 2;
      dFreqs[i*3+a]  = 0.04 + Math.random() * 0.18;
      dAmps[i*3+a]   = 0.03 + Math.random() * 0.11;
    }
  }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  const circleTex = makeCircleTexture();
  const dMat = new THREE.PointsMaterial({
    color: 0x888888, size: 0.05, sizeAttenuation: true,
    map: circleTex, transparent: true, alphaTest: 0.001, opacity: 0.4,
  });
  scene.add(new THREE.Points(dGeo, dMat));
  toDispose.push(dGeo, dMat, circleTex);

  // ── Spawn & decision timers ───────────────────────────────────────────────
  let spawnTimer = 0;
  let dec1Timer  = 0;
  let dec1Side   = 0;              // 0 = top, 1 = bot
  const SPAWN_INT = 1.3;
  const DEC_INT   = 4.2;

  // ── Animation loop ────────────────────────────────────────────────────────
  let rafId, lastTime = 0;

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min((now - lastTime) * 0.001, 0.05);
    lastTime = now;
    if (dt <= 0) return;

    const t = now * 0.001;

    // ── Global timers ──────────────────────────────────────────────────────
    dec1Timer += dt;
    if (dec1Timer >= DEC_INT) { dec1Timer = 0; dec1Side ^= 1; }

    spawnTimer += dt;
    if (spawnTimer >= SPAWN_INT) { spawnTimer -= SPAWN_INT; spawnBox('start'); }


    // ── Race competitors ───────────────────────────────────────────────────
    if (!raceDone) {
      raceTimer += dt;
      for (const c of raceComps) {
        if (!c.active) continue;
        c.localX += c.speed * dt;
        c.mesh.position.set(
          P.race.x - 0.85 + c.localX,
          GY, P.race.z + c.laneZ,
        );
        c.mesh.rotation.y += dt * 2;
      }
      if (raceTimer >= 1.4) {
        // Race over — hide competitors, unblock winner
        raceDone = true;
        for (const c of raceComps) { c.active = false; c.mesh.visible = false; }
        if (raceTrigger && raceTrigger.state === 'race') {
          raceTrigger.pathId        = raceTrigger.nextPath;
          raceTrigger.t             = 0;
          raceTrigger.state         = 'moving';
          raceTrigger.mesh.visible  = true;
          raceTrigger.mesh.position.set(P.race.x, GY, P.race.z);
        }
        raceTrigger = null;
      }
    }

    // ── Data boxes ─────────────────────────────────────────────────────────
    for (const b of pool) {
      if (!b.active) continue;

      // ── Node animation state ─────────────────────────────────────────────
      if (b.state === 'anim') {
        b.animTimer += dt;
        const prog = b.animTimer / b.animDur;

        if (b.animType === 'spin') {
          b.mesh.rotation.y = prog * Math.PI * 4;
        } else if (b.animType === 'jump') {
          b.mesh.position.y = GY + Math.sin(prog * Math.PI) * 0.38;
        } else {
          // shake
          b.mesh.position.x = b.basePos.x + (Math.random() - 0.5) * 0.04;
          b.mesh.position.z = b.basePos.z + (Math.random() - 0.5) * 0.04;
        }

        if (b.animTimer >= b.animDur) {
          b.mesh.rotation.set(0, 0, 0);
          if (b.nextPath) {
            b.pathId = b.nextPath;
            b.t      = 0;
            b.state  = 'moving';
            b.nextPath = '';
          } else {
            killBox(b);
          }
        }
        continue;
      }

      // ── Race-waiting state ────────────────────────────────────────────────
      if (b.state === 'race') continue; // handled above

      // ── Moving state ─────────────────────────────────────────────────────
      const seg = PATHS[b.pathId];
      if (!seg) { killBox(b); continue; }

      b.t += seg.tSpeed * dt;

      if (b.t < 1.0) {
        const pos = polyPos(seg.pts, b.t);
        b.mesh.position.set(pos.x, GY, pos.z);
        b.mesh.rotation.y += dt * 0.4; // very gentle wobble
        continue;
      }

      // ── Reached end of segment — trigger node behavior ───────────────────
      const endPt = seg.pts[seg.pts.length - 1];
      b.mesh.position.set(endPt.x, GY, endPt.z);
      b.basePos.copy(b.mesh.position);

      switch (seg.nodeType) {

        case 'task': {
          const anims = ['spin', 'jump', 'shake'];
          b.animType  = anims[Math.floor(Math.random() * 3)];
          b.animDur   = 0.45 + Math.random() * 0.35;
          b.animTimer = 0;
          b.state     = 'anim';
          b.nextPath  = seg.next[0] || '';
          break;
        }

        case 'split': {
          // Fan out — this box becomes the first branch, spawn rest
          for (let i = 1; i < seg.next.length; i++) spawnBox(seg.next[i], 0);
          b.pathId = seg.next[0];
          b.t = 0;
          break;
        }

        case 'decision': {
          // Flip decision
          const side = dec1Side;
          b.nextPath  = seg.next[side] || seg.next[0];
          b.animType  = 'jump';
          b.animDur   = 0.38;
          b.animTimer = 0;
          b.state     = 'anim';
          break;
        }

        case 'decision-merge': {
          // Always continues (merge point)
          b.nextPath  = seg.next[0] || '';
          b.animType  = 'jump';
          b.animDur   = 0.3;
          b.animTimer = 0;
          b.state     = 'anim';
          break;
        }

        case 'race': {
          if (raceDone) {
            // Start race
            raceDone    = false;
            raceTimer   = 0;
            raceTrigger = b;
            b.state     = 'race';
            b.nextPath  = seg.next[0] || '';
            b.mesh.visible = false; // hide during race
            // Launch competitor boxes inside the race box
            for (const [ci, c] of raceComps.entries()) {
              c.active  = true;
              c.localX  = 0;
              // Winner (index 0) is always fastest
              c.speed   = ci === 0 ? 1.6 + Math.random() * 0.2 : 0.6 + Math.random() * 0.5;
              c.mesh.position.set(P.race.x - 0.85, GY, P.race.z + c.laneZ);
              c.mesh.visible = true;
              c.mesh.rotation.set(0, 0, 0);
            }
          } else {
            // Race already running — box gets absorbed
            killBox(b);
          }
          break;
        }

        default: {
          // No node — continue or die
          if (seg.next.length > 0) {
            b.pathId = seg.next[0];
            b.t      = 0;
          } else {
            killBox(b);
          }
        }
      }
    }

    // ── Atmospheric dust ────────────────────────────────────────────────────
    for (let i = 0; i < DUST; i++) {
      dPos[i*3]   = dOrigins[i*3]   + Math.sin(t * dFreqs[i*3]   + dPhases[i*3])   * dAmps[i*3];
      dPos[i*3+1] = dOrigins[i*3+1] + Math.sin(t * dFreqs[i*3+1] + dPhases[i*3+1]) * dAmps[i*3+1];
      dPos[i*3+2] = dOrigins[i*3+2] + Math.sin(t * dFreqs[i*3+2] + dPhases[i*3+2]) * dAmps[i*3+2];
    }
    dGeo.attributes.position.needsUpdate = true;

    // Slowly rotate decision diamonds

    renderer.render(scene, camera);
  }

  rafId = requestAnimationFrame(t0 => { lastTime = t0; rafId = requestAnimationFrame(tick); });

  // ── Resize ────────────────────────────────────────────────────────────────
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // ── Dispose ───────────────────────────────────────────────────────────────
  return function dispose() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    for (const o of toDispose) o.dispose();
    renderer.dispose();
  };
}
