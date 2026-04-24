import * as THREE from 'three';
import { extrude } from 'tess-extrude';

export function initTessExtrudeEngine(canvas) {
  const toDispose = [];

  // ── renderer ──────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // ── scene ─────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  // ── camera ────────────────────────────────────────────────────────────
  // Placed directly above, pointing straight down — like a light bulb over a table.
  // camera.up must be set before lookAt to avoid gimbal lock.
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
  );
  camera.up.set(0, 0, -1);
  camera.position.set(0, 350, 0);
  camera.lookAt(0, 0, 0);

  // ── surface via tess-extrude ──────────────────────────────────────────
  // Four corners of a large rectangle.  tess-extrude tessellates the interior
  // with constrained Delaunay triangulation and extrudes it along Z.
  const points = [
    { x: -320, y: -180 },
    { x:  320, y: -180 },
    { x:  320, y:  180 },
    { x: -320, y:  180 },
  ];

  const indexedGeo = extrude(
    { type: 'points', points },
    { depth: 6, capDensity: 9, edgeSubdivisions: 3 },
  );

  let surfaceMesh = null;

  if (indexedGeo) {
    // Convert to non-indexed so each triangle owns its 3 vertices — the only
    // way to assign a per-face color via a vertex-color attribute.
    const geo = indexedGeo.toNonIndexed();
    indexedGeo.dispose();
    toDispose.push(geo);

    const vertCount = geo.attributes.position.count;
    const triCount  = vertCount / 3;
    const colors    = new Float32Array(vertCount * 3);

    // Golden-ratio hue stepping distributes colors evenly without clustering.
    const PHI = 0.618033988749895;
    const tmp = new THREE.Color();

    for (let i = 0; i < triCount; i++) {
      const h = (i * PHI) % 1.0;
      const s = 0.55 + (Math.sin(i * 0.9) * 0.5 + 0.5) * 0.35;
      const l = 0.38 + (Math.sin(i * 1.7) * 0.5 + 0.5) * 0.28;
      tmp.setHSL(h, s, l);
      for (let v = 0; v < 3; v++) {
        const vi = (i * 3 + v) * 3;
        colors[vi]     = tmp.r;
        colors[vi + 1] = tmp.g;
        colors[vi + 2] = tmp.b;
      }
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Coloured faces, pushed slightly back to avoid z-fighting with the wireframe.
    const colorMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    toDispose.push(colorMat);

    const colorMesh = new THREE.Mesh(geo, colorMat);

    // Wireframe overlay draws dark triangle edges so the mosaic reads clearly.
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    toDispose.push(wireMat);
    const wireMesh = new THREE.Mesh(geo, wireMat);

    // Group both meshes so they rotate together.
    surfaceMesh = new THREE.Group();
    surfaceMesh.add(colorMesh);
    surfaceMesh.add(wireMesh);

    // Rotate from XY plane (library default) to XZ plane so it lies flat.
    surfaceMesh.rotation.x = -Math.PI / 2;

    scene.add(surfaceMesh);
  }

  // ── render ────────────────────────────────────────────────────────────
  // Nothing animates — render once and stop. Re-render only on resize.
  renderer.render(scene, camera);

  // ── resize ────────────────────────────────────────────────────────────
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  window.addEventListener('resize', onResize);

  return function dispose() {
    window.removeEventListener('resize', onResize);
    for (const o of toDispose) o.dispose();
    renderer.dispose();
  };
}
