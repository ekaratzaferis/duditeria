import * as THREE from 'three';

function makeCircleTexture(size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.8)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

export function initVoidEngine(canvas) {
  const isMobile = window.innerWidth < 768;
  const circleTexture = makeCircleTexture();

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  // Scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.08);

  // Camera
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5.5);
  camera.lookAt(0, 0, 0);

  // ─── Central Relic — Torus Knot ───────────────────────────────────────────

  const knotGeo = new THREE.TorusKnotGeometry(1, 0.32, 200, 16, 2, 3);

  // Wireframe shell — structural skeleton
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x2a2a4a,
    wireframe: true,
    transparent: true,
    opacity: 0.55,
  });
  const wireframeMesh = new THREE.Mesh(knotGeo, wireframeMat);
  scene.add(wireframeMesh);

  // Solid ghost — inner glow
  const ghostMat = new THREE.MeshBasicMaterial({
    color: 0xe8e8f8,
    transparent: true,
    opacity: 0.03,
  });
  const ghostMesh = new THREE.Mesh(knotGeo, ghostMat);
  scene.add(ghostMesh);

  // ─── Particle Nebula ──────────────────────────────────────────────────────

  const particleCount = isMobile ? 250 : 600;
  const tracerCount = isMobile ? 0 : 100;
  const drifterCount = particleCount - tracerCount;

  // Drifters — slow sine-wave oscillators suspended in space
  const drifterPositions = new Float32Array(drifterCount * 3);
  const drifterPhases = new Float32Array(drifterCount * 3); // phase per axis per particle
  const drifterFreqs = new Float32Array(drifterCount * 3);  // frequency per axis
  const drifterAmps = new Float32Array(drifterCount * 3);   // amplitude per axis
  const drifterOrigins = new Float32Array(drifterCount * 3); // rest position

  for (let i = 0; i < drifterCount; i++) {
    // Hollow sphere shell, radius 2.4 – 5.0
    let x, y, z, r;
    do {
      x = (Math.random() - 0.5) * 10;
      y = (Math.random() - 0.5) * 10;
      z = (Math.random() - 0.5) * 10;
      r = Math.sqrt(x * x + y * y + z * z);
    } while (r < 2.4 || r > 5.0);

    drifterOrigins[i * 3] = x;
    drifterOrigins[i * 3 + 1] = y;
    drifterOrigins[i * 3 + 2] = z;

    drifterPositions[i * 3] = x;
    drifterPositions[i * 3 + 1] = y;
    drifterPositions[i * 3 + 2] = z;

    // Unique oscillation per axis — periods between 20s and 60s (at 60fps)
    for (let a = 0; a < 3; a++) {
      drifterPhases[i * 3 + a] = Math.random() * Math.PI * 2;
      drifterFreqs[i * 3 + a] = 0.0008 + Math.random() * 0.0012; // rad/frame
      drifterAmps[i * 3 + a] = 0.04 + Math.random() * 0.08;       // units
    }
  }

  const drifterGeo = new THREE.BufferGeometry();
  drifterGeo.setAttribute('position', new THREE.BufferAttribute(drifterPositions, 3));

  const drifterMat = new THREE.PointsMaterial({
    color: 0xb0b0c8,
    size: 0.025,
    sizeAttenuation: true,
    map: circleTexture,
    transparent: true,
    alphaTest: 0.001,
    opacity: 0.7,
  });

  const drifters = new THREE.Points(drifterGeo, drifterMat);
  scene.add(drifters);

  // Tracers — slow elliptical orbits
  let tracers = null;
  let tracerAngles = null;
  let tracerSpeeds = null;
  let tracerAxes = null;
  let tracerRadii = null;

  if (tracerCount > 0) {
    const tracerPositions = new Float32Array(tracerCount * 3);
    tracerAngles = new Float32Array(tracerCount);
    tracerSpeeds = new Float32Array(tracerCount);
    tracerAxes = [];   // random tilt axis per tracer
    tracerRadii = new Float32Array(tracerCount * 2); // major, minor radii

    for (let i = 0; i < tracerCount; i++) {
      tracerAngles[i] = Math.random() * Math.PI * 2;
      // Speed: one full orbit in 45–90s at 60fps → 2π / (fps * seconds)
      tracerSpeeds[i] = (Math.PI * 2) / (60 * (45 + Math.random() * 45));
      tracerRadii[i * 2] = 1.8 + Math.random() * 1.6;     // major
      tracerRadii[i * 2 + 1] = 1.2 + Math.random() * 1.2; // minor

      // Random orbital plane — tilt axis
      const tilt = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      tracerAxes.push(tilt);

      tracerPositions[i * 3] = 0;
      tracerPositions[i * 3 + 1] = 0;
      tracerPositions[i * 3 + 2] = 0;
    }

    const tracerGeo = new THREE.BufferGeometry();
    tracerGeo.setAttribute('position', new THREE.BufferAttribute(tracerPositions, 3));

    const tracerMat = new THREE.PointsMaterial({
      color: 0xd8d8f0,
      size: 0.035,
      sizeAttenuation: true,
      map: circleTexture,
      transparent: true,
      alphaTest: 0.001,
      opacity: 0.85,
    });

    tracers = new THREE.Points(tracerGeo, tracerMat);
    scene.add(tracers);
  }

  // ─── Faint Indigo Point Light ─────────────────────────────────────────────
  const innerLight = new THREE.PointLight(0x3333aa, 0.4, 6);
  innerLight.position.set(0, 0, 0);
  scene.add(innerLight);

  // ─── Animation Loop ───────────────────────────────────────────────────────

  let frameId;
  let frame = 0;

  const _v3 = new THREE.Vector3();
  const _quat = new THREE.Quaternion();

  function animate() {
    frameId = requestAnimationFrame(animate);
    frame++;

    // Rotate the relic — three axes at different rates, never repeats
    wireframeMesh.rotation.y += 0.0008;
    wireframeMesh.rotation.x += 0.0003;
    wireframeMesh.rotation.z += 0.0001;
    ghostMesh.rotation.copy(wireframeMesh.rotation);

    // Update drifter positions — sine oscillation around rest positions
    const dpos = drifterGeo.attributes.position.array;
    for (let i = 0; i < drifterCount; i++) {
      const t = frame;
      dpos[i * 3] = drifterOrigins[i * 3] + Math.sin(t * drifterFreqs[i * 3] + drifterPhases[i * 3]) * drifterAmps[i * 3];
      dpos[i * 3 + 1] = drifterOrigins[i * 3 + 1] + Math.sin(t * drifterFreqs[i * 3 + 1] + drifterPhases[i * 3 + 1]) * drifterAmps[i * 3 + 1];
      dpos[i * 3 + 2] = drifterOrigins[i * 3 + 2] + Math.sin(t * drifterFreqs[i * 3 + 2] + drifterPhases[i * 3 + 2]) * drifterAmps[i * 3 + 2];
    }
    drifterGeo.attributes.position.needsUpdate = true;

    // Update tracer positions — elliptical orbits
    if (tracers && tracerCount > 0) {
      const tpos = tracers.geometry.attributes.position.array;
      for (let i = 0; i < tracerCount; i++) {
        tracerAngles[i] += tracerSpeeds[i];
        const a = tracerAngles[i];
        const rMaj = tracerRadii[i * 2];
        const rMin = tracerRadii[i * 2 + 1];

        // Ellipse in XZ plane, then rotate by tilt axis
        _v3.set(Math.cos(a) * rMaj, 0, Math.sin(a) * rMin);

        // Apply tilt rotation
        const axis = tracerAxes[i];
        _quat.setFromAxisAngle(axis, tracerAngles[i] * 0.1); // gentle precession
        _v3.applyQuaternion(_quat);

        tpos[i * 3] = _v3.x;
        tpos[i * 3 + 1] = _v3.y;
        tpos[i * 3 + 2] = _v3.z;
      }
      tracers.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  // ─── Resize Handler ───────────────────────────────────────────────────────

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onResize);

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  return function dispose() {
    cancelAnimationFrame(frameId);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    circleTexture.dispose();
    knotGeo.dispose();
    wireframeMat.dispose();
    ghostMat.dispose();
    drifterGeo.dispose();
    drifterMat.dispose();
    if (tracers) {
      tracers.geometry.dispose();
      tracers.material.dispose();
    }
  };
}
