import * as THREE from 'three';

// ── Constants ────────────────────────────────────────────────────────────────

const TW = 55;                          // terrain width
const TD = 55;                          // terrain depth
const TS = 80;                          // terrain segments per side
const N_COUNT = 55;                     // neurons per jello
const MAX_SPRING_BUF = 600;            // spring line buffer size
const SPAWN_INTERVAL = 18;             // seconds between jello drops
const MAX_JELLOS = 2;
const GRAVITY = -8;
const DAMP_AIR = 0.978;
const DAMP_GND = 0.88;                 // less sticky — jellos keep shape after landing
const SPRING_SCALE = 45;
const DT = 1 / 60;

// ── Static terrain height — baked at init, never changes ─────────────────────

function staticHeight(wx, wz) {
  return (
    Math.sin(wx * 0.18)              * 0.45 +
    Math.cos(wz * 0.15)              * 0.38 +
    Math.sin(wx * 0.09 - wz * 0.07) * 0.55 +
    Math.cos(wx * 0.06 + wz * 0.10) * 0.42 +
    Math.sin(wx * 0.28 + wz * 0.22) * 0.15
  );
}

// ── Circle sprite texture (shared) ───────────────────────────────────────────

function makeCircleTexture(size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const h = size / 2;
  const g = ctx.createRadialGradient(h, h, 0, h, h, h);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.8)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

// ── Terrain ───────────────────────────────────────────────────────────────────

class Terrain {
  constructor(scene) {
    this.geo = new THREE.PlaneGeometry(TW, TD, TS, TS);
    this.geo.rotateX(-Math.PI / 2);
    this.geo.attributes.position.usage = THREE.DynamicDrawUsage;

    this.mat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x000000,
      emissiveIntensity: 0,
      roughness: 1.0,
      metalness: 0.0,
    });

    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.mesh.receiveShadow = true;
    scene.add(this.mesh);

    const vCount = (TS + 1) * (TS + 1);
    this.perturb = new Float32Array(vCount);
    this.baseY   = new Float32Array(vCount);

    // Bake static heights once
    const pos  = this.geo.attributes.position;
    const segW = TW / TS;
    const segD = TD / TS;
    for (let i = 0; i <= TS; i++) {
      for (let j = 0; j <= TS; j++) {
        const v  = i * (TS + 1) + j;
        const wx = -TW / 2 + j * segW;
        const wz = -TD / 2 + i * segD;
        this.baseY[v] = staticHeight(wx, wz);
        pos.setY(v, this.baseY[v]);
      }
    }
    pos.needsUpdate = true;
    this.geo.computeVertexNormals();
    this._dirty = false;
  }

  update() {
    if (!this._dirty) return;
    const pos = this.geo.attributes.position;
    let stillDirty = false;
    for (let v = 0, n = this.baseY.length; v < n; v++) {
      if (Math.abs(this.perturb[v]) < 0.0002) { this.perturb[v] = 0; continue; }
      pos.setY(v, this.baseY[v] + this.perturb[v]);
      this.perturb[v] *= 0.994;
      stillDirty = true;
    }
    this._dirty = stillDirty;
    pos.needsUpdate = true;
    this.geo.computeVertexNormals();
  }

  getHeight(wx, wz) {
    const halfW = TW / 2;
    const halfD = TD / 2;
    const jf = Math.max(0, Math.min(TS, (wx + halfW) / TW * TS));
    const if_ = Math.max(0, Math.min(TS, (wz + halfD) / TD * TS));
    const j0 = Math.min(TS - 1, Math.floor(jf));
    const i0 = Math.min(TS - 1, Math.floor(if_));
    const tj = jf - j0;
    const ti = if_ - i0;
    const pos = this.geo.attributes.position;
    const h00 = pos.getY(i0 * (TS + 1) + j0);
    const h10 = pos.getY(i0 * (TS + 1) + j0 + 1);
    const h01 = pos.getY((i0 + 1) * (TS + 1) + j0);
    const h11 = pos.getY((i0 + 1) * (TS + 1) + j0 + 1);
    return h00 * (1 - tj) * (1 - ti) + h10 * tj * (1 - ti) + h01 * (1 - tj) * ti + h11 * tj * ti;
  }

  deform(wx, wz, amount, radius) {
    const halfW = TW / 2;
    const halfD = TD / 2;
    const segW = TW / TS;
    const segD = TD / TS;
    const ri = Math.ceil(radius / Math.min(segW, segD)) + 1;
    const cj = Math.round((wx + halfW) / segW);
    const ci = Math.round((wz + halfD) / segD);

    for (let di = -ri; di <= ri; di++) {
      for (let dj = -ri; dj <= ri; dj++) {
        const gi = ci + di;
        const gj = cj + dj;
        if (gi < 0 || gi > TS || gj < 0 || gj > TS) continue;
        const vx = -halfW + gj * segW;
        const vz = -halfD + gi * segD;
        const dist = Math.sqrt((vx - wx) ** 2 + (vz - wz) ** 2);
        if (dist > radius) continue;
        const falloff = (1 - dist / radius) ** 2;
        const idx = gi * (TS + 1) + gj;
        this.perturb[idx] = Math.max(-2.5, Math.min(1.0, this.perturb[idx] + amount * falloff));
      }
    }
    this._dirty = true;
  }

  dispose(scene) {
    scene.remove(this.mesh);
    this.geo.dispose();
    this.mat.dispose();
  }
}

// ── Ambient particles ─────────────────────────────────────────────────────────

function buildParticles(scene, tex) {
  const count = 280;
  const pos = new Float32Array(count * 3);
  const origins = new Float32Array(count * 3);
  const phases = new Float32Array(count * 3);
  const freqs  = new Float32Array(count * 3);
  const amps   = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    let x, z, r;
    do {
      x = (Math.random() - 0.5) * 22;
      z = (Math.random() - 0.5) * 22;
      r = Math.sqrt(x * x + z * z);
    } while (r < 2);
    const y = 4 + Math.random() * 10;
    origins[i*3]=x; origins[i*3+1]=y; origins[i*3+2]=z;
    pos[i*3]=x;     pos[i*3+1]=y;     pos[i*3+2]=z;
    for (let a = 0; a < 3; a++) {
      phases[i*3+a] = Math.random() * Math.PI * 2;
      freqs[i*3+a]  = 0.0004 + Math.random() * 0.0009;
      amps[i*3+a]   = 0.04 + Math.random() * 0.09;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xaaaaaa, size: 0.022, sizeAttenuation: true,
    map: tex, transparent: true, alphaTest: 0.001, opacity: 0.3,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return { pts, geo, mat, pos, origins, phases, freqs, amps, count };
}

function tickParticles(p, frame) {
  for (let i = 0; i < p.count; i++) {
    p.pos[i*3]   = p.origins[i*3]   + Math.sin(frame*p.freqs[i*3]  +p.phases[i*3])  *p.amps[i*3];
    p.pos[i*3+1] = p.origins[i*3+1] + Math.sin(frame*p.freqs[i*3+1]+p.phases[i*3+1])*p.amps[i*3+1];
    p.pos[i*3+2] = p.origins[i*3+2] + Math.sin(frame*p.freqs[i*3+2]+p.phases[i*3+2])*p.amps[i*3+2];
  }
  p.geo.attributes.position.needsUpdate = true;
}

// ── Dust (low-floating near terrain) ─────────────────────────────────────────

function buildDust(scene, tex) {
  const count = 1800;
  const pos     = new Float32Array(count * 3);
  const origins = new Float32Array(count * 3);
  const phases  = new Float32Array(count * 3);
  const freqs   = new Float32Array(count * 3);
  const amps    = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * TW * 1.1;
    const z = (Math.random() - 0.5) * TD * 1.1;
    // Two thirds hug the ground, one third float higher for volumetric look
    const y = i < count * 0.65
      ? 0.05 + Math.random() * 4.0       // ground haze
      : 4.0  + Math.random() * 10.0;     // high floating fog
    origins[i*3]=x; origins[i*3+1]=y; origins[i*3+2]=z;
    pos[i*3]=x;     pos[i*3+1]=y;     pos[i*3+2]=z;
    for (let a = 0; a < 3; a++) {
      phases[i*3+a] = Math.random() * Math.PI * 2;
      freqs[i*3+a]  = 0.00015 + Math.random() * 0.0004;  // very slow drift
      amps[i*3+a]   = 0.1 + Math.random() * 0.35;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xdddddd, size: 0.03, sizeAttenuation: true,
    map: tex, transparent: true, alphaTest: 0.001, opacity: 0.18,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return { pts, geo, mat, pos, origins, phases, freqs, amps, count };
}

// ── Jello ─────────────────────────────────────────────────────────────────────

class Jello {
  constructor(cx, cy, cz, scene, tex) {
    this.scene = scene;
    this.age = 0;
    this._dir = new THREE.Vector3();

    // — Neurons
    this.neurons = [];
    this._centroid = new THREE.Vector3();
    this._pDir = new THREE.Vector3();
    const R = 1.8;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    for (let i = 0; i < N_COUNT; i++) {
      const fy = 1 - (i / (N_COUNT - 1)) * 2;
      const r  = Math.sqrt(Math.max(0, 1 - fy * fy));
      const th = phi * i;
      this.neurons.push({
        pos: new THREE.Vector3(cx + Math.cos(th)*r*R, cy + fy*R, cz + Math.sin(th)*r*R),
        vel: new THREE.Vector3((Math.random()-0.5)*0.6, -0.5+Math.random()*0.3, (Math.random()-0.5)*0.6),
        force: new THREE.Vector3(),
        strength: Math.random(),
        onGround: false,
      });
    }

    // — Springs: k-nearest neighbours
    this.springs = [];
    this._connSet = new Set();
    this._buildInitialSprings(6);

    // — Neuron render (Points)
    this._nPos = new Float32Array(N_COUNT * 3);
    const nGeo = new THREE.BufferGeometry();
    nGeo.setAttribute('position', new THREE.BufferAttribute(this._nPos, 3));
    const nMat = new THREE.PointsMaterial({
      color: 0xe8e8e8, size: 0.065, sizeAttenuation: true,
      map: tex, transparent: true, alphaTest: 0.001, opacity: 0.95,
    });
    this._nGeo = nGeo;
    this.neuronPts = new THREE.Points(nGeo, nMat);
    scene.add(this.neuronPts);

    // — Spring render (LineSegments)
    this._sPos = new Float32Array(MAX_SPRING_BUF * 6);
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(this._sPos, 3));
    sGeo.setDrawRange(0, 0);
    const sMat = new THREE.LineBasicMaterial({ color: 0xc0c0c0, transparent: true, opacity: 0.55 });
    this._sGeo = sGeo;
    this.springLines = new THREE.LineSegments(sGeo, sMat);
    scene.add(this.springLines);

  }

  _buildInitialSprings(k) {
    for (let i = 0; i < N_COUNT; i++) {
      const dists = [];
      for (let j = 0; j < N_COUNT; j++) {
        if (i === j) continue;
        dists.push({ j, d: this.neurons[i].pos.distanceTo(this.neurons[j].pos) });
      }
      dists.sort((a, b) => a.d - b.d);
      for (let n = 0; n < Math.min(k, dists.length); n++) {
        const { j, d } = dists[n];
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!this._connSet.has(key)) {
          this._connSet.add(key);
          const stiff = 0.1 + Math.random() * 0.85;
          // Weak springs break early, strong ones never break
          const breakAt = stiff < 0.3 ? 1.5 : stiff < 0.65 ? 2.2 : Infinity;
          this.springs.push({ a: i, b: j, rest: d, stiff, breakAt, alive: true });
        }
      }
    }
  }

  update(terrain) {
    this.age++;

    // — Internal pressure: push neurons outward from centroid to resist flattening
    this._centroid.set(0, 0, 0);
    for (const n of this.neurons) this._centroid.add(n.pos);
    this._centroid.divideScalar(N_COUNT);
    for (const n of this.neurons) {
      this._pDir.subVectors(n.pos, this._centroid);
      const d = this._pDir.length();
      if (d < 0.001) continue;
      // Pressure ramps up sharply when compressed below rest radius
      const pressure = Math.max(0, (1.4 - d) * 1.8);
      n.force.addScaledVector(this._pDir.normalize(), pressure);
    }

    // — Spring forces
    for (const sp of this.springs) {
      if (!sp.alive) continue;
      this._dir.subVectors(this.neurons[sp.b].pos, this.neurons[sp.a].pos);
      const dist = this._dir.length();
      if (dist < 0.001) continue;
      if (dist > sp.rest * sp.breakAt) { sp.alive = false; continue; }
      const mag = (dist - sp.rest) * sp.stiff * SPRING_SCALE;
      this._dir.normalize();
      this.neurons[sp.a].force.addScaledVector(this._dir,  mag);
      this.neurons[sp.b].force.addScaledVector(this._dir, -mag);
    }

    // — Integrate
    const bndW = TW / 2 - 0.4;
    const bndD = TD / 2 - 0.4;
    for (const n of this.neurons) {
      n.force.y += GRAVITY;
      n.vel.addScaledVector(n.force, DT);
      n.vel.multiplyScalar(n.onGround ? DAMP_GND : DAMP_AIR);
      n.pos.addScaledVector(n.vel, DT);
      n.force.set(0, 0, 0);

      // Boundary clamp
      n.pos.x = Math.max(-bndW, Math.min(bndW, n.pos.x));
      n.pos.z = Math.max(-bndD, Math.min(bndD, n.pos.z));

      // Terrain collision
      const ty = terrain.getHeight(n.pos.x, n.pos.z);
      if (n.pos.y < ty + 0.04) {
        n.pos.y = ty + 0.04;
        if (n.vel.y < 0) n.vel.y *= -0.12; // very little bounce — jello, not rubber
        n.vel.x *= 0.68;
        n.vel.z *= 0.68;
        n.onGround = true;

        // Strong neurons push terrain down, weak ones pushed up
        if (n.strength > 0.65) {
          terrain.deform(n.pos.x, n.pos.z, -0.012 * n.strength, 0.75);
        } else if (n.strength < 0.2 && n.vel.y > 0.05) {
          terrain.deform(n.pos.x, n.pos.z, 0.004, 0.4); // very weak push-up
        }
      } else {
        n.onGround = false;
      }
    }

    // — Birth new springs when neurons drift close (every 40 frames)
    if (this.age % 40 === 0) {
      let born = 0;
      outer: for (let i = 0; i < N_COUNT; i++) {
        for (let j = i + 1; j < N_COUNT && born < 4; j++) {
          const key = `${i}-${j}`;
          if (this._connSet.has(key)) continue;
          const d = this.neurons[i].pos.distanceTo(this.neurons[j].pos);
          if (d < 0.65) {
            this._connSet.add(key);
            // Newborn springs are frail
            this.springs.push({ a: i, b: j, rest: d, stiff: 0.04 + Math.random() * 0.12, breakAt: 1.25, alive: true });
            born++;
          }
        }
        if (born >= 4) break outer;
      }
    }

    // — Sync render geometry
    this._syncGeometry();

  }

  _syncGeometry() {
    for (let i = 0; i < N_COUNT; i++) {
      this._nPos[i*3]   = this.neurons[i].pos.x;
      this._nPos[i*3+1] = this.neurons[i].pos.y;
      this._nPos[i*3+2] = this.neurons[i].pos.z;
    }
    this._nGeo.attributes.position.needsUpdate = true;

    let si = 0;
    for (const sp of this.springs) {
      if (!sp.alive || si >= MAX_SPRING_BUF) continue;
      const a = this.neurons[sp.a].pos;
      const b = this.neurons[sp.b].pos;
      this._sPos[si*6]   = a.x; this._sPos[si*6+1] = a.y; this._sPos[si*6+2] = a.z;
      this._sPos[si*6+3] = b.x; this._sPos[si*6+4] = b.y; this._sPos[si*6+5] = b.z;
      si++;
    }
    this._sGeo.setDrawRange(0, si * 2);
    this._sGeo.attributes.position.needsUpdate = true;
  }

  dispose() {
    this.scene.remove(this.neuronPts);
    this.scene.remove(this.springLines);
    this._nGeo.dispose();
    this._sGeo.dispose();
    this.neuronPts.material.dispose();
    this.springLines.material.dispose();
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function initOrganismEngine(canvas) {
  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xaaaaaa, 1);
  renderer.shadowMap.enabled = false;

  // Scene + fog — grey atmosphere, gentle falloff so terrain is visible
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xaaaaaa, 0.018);

  // Camera
  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 22, 30);
  camera.lookAt(0, 0, 0);

  // ── Lights — single off-screen top-right source ────────────────────────────
  const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
  sunLight.position.set(60, 80, -20); // far top-right, off-screen
  scene.add(sunLight);

  // Very faint ambient so the unlit side of terrain isn't pure void
  scene.add(new THREE.AmbientLight(0x888888, 0.08));

  // ── Terrain ────────────────────────────────────────────────────────────────
  const terrain = new Terrain(scene);

  // ── Particles + dust ───────────────────────────────────────────────────────
  const tex = makeCircleTexture();
  const particles = buildParticles(scene, tex);
  const dust = buildDust(scene, tex);

  // ── Jello spawner ──────────────────────────────────────────────────────────
  const jellos = [];
  let lastSpawn = -SPAWN_INTERVAL; // trigger first drop immediately

  function spawnJello(t) {
    if (jellos.length >= MAX_JELLOS) {
      // Remove oldest before spawning new
      jellos.shift().dispose();
    }
    const angle = Math.random() * Math.PI * 2;
    const r = 4 + Math.random() * 10;
    jellos.push(new Jello(
      Math.cos(angle) * r,
      12 + Math.random() * 3,
      Math.sin(angle) * r,
      scene, tex,
    ));
    lastSpawn = t;
  }

  // ── Loop ───────────────────────────────────────────────────────────────────
  let frameId;
  let frame = 0;

  function animate(now) {
    frameId = requestAnimationFrame(animate);
    const t = now * 0.001;
    frame++;

    if (t - lastSpawn >= SPAWN_INTERVAL) spawnJello(t);

    terrain.update();
    tickParticles(particles, frame);
    tickParticles(dust, frame);
    for (const j of jellos) j.update(terrain);

    renderer.render(scene, camera);
  }

  animate(performance.now());

  // ── Resize ─────────────────────────────────────────────────────────────────
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // ── Cleanup ─────────────────────────────────────────────────────────────────
  return function dispose() {
    cancelAnimationFrame(frameId);
    window.removeEventListener('resize', onResize);
    for (const j of jellos) j.dispose();
    terrain.dispose(scene);
    particles.geo.dispose(); particles.mat.dispose();
    dust.geo.dispose(); dust.mat.dispose();
    tex.dispose();
    renderer.dispose();
  };
}
