import * as THREE from 'three';
import * as flexy from 'flexy-bend';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Desk lamp whose arm is a straight cylinder bent with flexy.bend().
// Drag on the scene to draw a new arm; the bend is applied live while drawing.

const BASE_TOP = 0.5;          // arm starts on top of the base
const MAX_ARM_LENGTH = 30;     // world units
const MIN_POINT_GAP = 0.35;    // ignore pointer jitter below this distance
const HEAD_DIR_SPAN = 2;       // world units of curve used to orient the head

const DEFAULT_POINTS = [
  [0, BASE_TOP, 0],
  [0, 8, 0],
  [2, 11, 0],
  [7, 11, 0],
  [7, 7.5, 0],
].map(([x, y, z]) => new THREE.Vector3(x, y, z));

// Chaikin corner cutting — smooths hand-drawn strokes, keeps both endpoints.
function chaikin(points, iterations = 3) {
  let pts = points;
  for (let k = 0; k < iterations; k++) {
    if (pts.length < 3) return pts;
    const out = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      out.push(a.clone().lerp(b, 0.25), a.clone().lerp(b, 0.75));
    }
    out.push(pts[pts.length - 1]);
    pts = out;
  }
  return pts;
}

function makeCurve(points) {
  const smooth = chaikin(points);
  return new THREE.CatmullRomCurve3(smooth, false, 'centripetal');
}

export function initFlexyEngine(canvas, ui = {}) {
  const toDispose = [];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Renderer ────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const BG = 0x08080a;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.Fog(BG, 35, 85);

  // Dim studio reflections so the metal reads as metal, not as a silhouette
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.22;
  pmrem.dispose();
  toDispose.push(envTex);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

  // ── Lights ──────────────────────────────────────────────────────────────
  scene.add(new THREE.HemisphereLight(0x9aa4c8, 0x0a0a0c, 0.35));

  const rim = new THREE.DirectionalLight(0x8899ff, 1.6);
  rim.position.set(-15, 18, -20);
  scene.add(rim);

  // ── Floor ───────────────────────────────────────────────────────────────
  const floorGeo = new THREE.PlaneGeometry(200, 200);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x141418, roughness: 0.92, metalness: 0 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  toDispose.push(floorGeo, floorMat);

  // ── Lamp ────────────────────────────────────────────────────────────────
  const metal = new THREE.MeshStandardMaterial({ color: 0x3a3a42, metalness: 0.8, roughness: 0.3 });
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x111111, metalness: 0.2, roughness: 0.6, side: THREE.BackSide,
  });
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffd28a });
  toDispose.push(metal, innerMat, bulbMat);

  const lamp = new THREE.Group();
  scene.add(lamp);

  const baseGeo = new THREE.CylinderGeometry(3, 3.3, 0.5, 48);
  const base = new THREE.Mesh(baseGeo, metal);
  base.position.y = 0.25;
  base.castShadow = true;
  base.receiveShadow = true;
  lamp.add(base);
  toDispose.push(baseGeo);

  // Arm: a straight cylinder along Y; the template positions are restored before every bend.
  const armGeo = new THREE.CylinderGeometry(0.28, 0.28, 20, 20, 160, true);
  const armTemplate = armGeo.attributes.position.array.slice();
  const arm = new THREE.Mesh(armGeo, metal);
  arm.castShadow = true;
  lamp.add(arm);
  toDispose.push(armGeo);

  // Head: cone shade + glowing bulb + spotlight, pointing down its local -Y.
  const head = new THREE.Group();
  lamp.add(head);

  const CONE_R = 3, CONE_H = 4.5;
  const shadeGeo = new THREE.ConeGeometry(CONE_R, CONE_H, 48, 1, true);
  shadeGeo.translate(0, -CONE_H * 0.4, 0);
  const shade = new THREE.Mesh(shadeGeo, metal);
  shade.castShadow = true;
  head.add(shade);
  const shadeInner = new THREE.Mesh(shadeGeo, innerMat);
  head.add(shadeInner);
  toDispose.push(shadeGeo);

  const bulbGeo = new THREE.SphereGeometry(0.7, 24, 16);
  const bulb = new THREE.Mesh(bulbGeo, bulbMat);
  bulb.position.y = -CONE_H * 0.55;
  head.add(bulb);
  toDispose.push(bulbGeo);

  const spot = new THREE.SpotLight(0xffb45a, 420, 70, Math.PI / 3.2, 0.85, 1.6);
  spot.position.set(0, -CONE_H * 0.5, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0005;
  head.add(spot);
  const spotTarget = new THREE.Object3D();
  spotTarget.position.set(0, -40, 0);
  head.add(spotTarget);
  spot.target = spotTarget;

  // Soft fill from inside the shade so the bulb glow reads on the arm
  const glow = new THREE.PointLight(0xffb45a, 6, 8, 2);
  glow.position.set(0, -CONE_H * 0.6, 0);
  head.add(glow);

  const DOWN = new THREE.Vector3(0, -1, 0);
  const ORIENTATION = new THREE.Vector3(0, 0, 1);
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();

  function applyArm(points) {
    if (points.length < 2) return;
    const curve = makeCurve(points);

    armGeo.attributes.position.array.set(armTemplate);
    flexy.bend({
      THREE,
      curve,
      orientation: ORIENTATION,
      bufferGeometry: armGeo,
      axis: 'y',
      mode: 'fit',
    });
    armGeo.computeVertexNormals();
    armGeo.computeBoundingSphere();

    // Orient the head along the average direction of the last few units of
    // the curve — robust against the jitter of the final pointer samples.
    const len = curve.getLength();
    const back = Math.min(HEAD_DIR_SPAN, len * 0.2) / len;
    curve.getPointAt(1, tmpA);
    curve.getPointAt(Math.max(0, 1 - back), tmpB);
    const dir = tmpA.clone().sub(tmpB);
    if (dir.lengthSq() < 1e-6) return;
    dir.normalize();

    head.position.copy(tmpA);
    head.quaternion.setFromUnitVectors(DOWN, dir);
  }

  // ── Framing ─────────────────────────────────────────────────────────────
  function frame() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const aspect = w / h;
    camera.aspect = aspect;

    if (aspect < 0.9) {
      // Portrait: lamp centred, camera further back
      lamp.position.set(-2.5, 0, 0);
      camera.position.set(-4, 14, 44);
      camera.lookAt(0, 8, 0);
    } else {
      // Landscape: lamp right of centre, leaving room for the title
      lamp.position.set(3, 0, 0);
      camera.position.set(-8, 12, 31);
      camera.lookAt(2, 6.5, 0);
    }

    // Turn the lamp mostly toward the camera so the drawing plane is readable,
    // but keep some angle so it still looks three-dimensional.
    const dx = camera.position.x - lamp.position.x;
    const dz = camera.position.z - lamp.position.z;
    lamp.rotation.y = Math.atan2(dx, dz) - 0.35;

    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  const ro = new ResizeObserver(frame);
  ro.observe(canvas);
  frame();

  // ── Drawing ─────────────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const plane = new THREE.Plane();
  const hit = new THREE.Vector3();

  let points = DEFAULT_POINTS.map((p) => p.clone());
  let drawing = false;
  let pointerId = null;
  let armLength = 0;
  let dirty = true;
  let idle = !reduced;
  let touchDrawMode = false;

  function pointerToLocal(e) {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);

    lamp.updateMatrixWorld();
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(lamp.quaternion);
    plane.setFromNormalAndCoplanarPoint(normal, lamp.position);
    if (!raycaster.ray.intersectPlane(plane, hit)) return null;

    const local = lamp.worldToLocal(hit.clone());
    local.z = 0;
    local.y = Math.max(local.y, BASE_TOP + 1.2);
    return local;
  }

  function canDraw(e) {
    if (e.pointerType === 'mouse') return e.button === 0;
    return touchDrawMode;
  }

  function onDown(e) {
    if (!canDraw(e)) return;
    const p = pointerToLocal(e);
    if (!p) return;
    e.preventDefault();
    drawing = true;
    idle = false;
    pointerId = e.pointerId;
    canvas.setPointerCapture(e.pointerId);

    // Short vertical stem so the arm always leaves the base upright
    points = [new THREE.Vector3(0, BASE_TOP, 0), new THREE.Vector3(0, BASE_TOP + 1.2, 0)];
    armLength = 1.2;
    addPoint(p);
    ui.root?.classList.add('is-drawing');
  }

  function addPoint(p) {
    const last = points[points.length - 1];
    const d = last.distanceTo(p);
    if (d < MIN_POINT_GAP) return;
    if (armLength + d > MAX_ARM_LENGTH) return;
    armLength += d;
    points.push(p);
    dirty = true;
  }

  function onMove(e) {
    if (!drawing || e.pointerId !== pointerId) return;
    // Coalesced events give a smoother stroke on fast moves
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of events.length ? events : [e]) {
      const p = pointerToLocal(ev);
      if (p) addPoint(p);
    }
  }

  function onUp(e) {
    if (!drawing || e.pointerId !== pointerId) return;
    drawing = false;
    pointerId = null;
    ui.root?.classList.remove('is-drawing');
    // Nothing is recomputed here: the arm keeps exactly the shape of the last
    // live frame, so it can't jump or flip when the pointer is released.
    if (points.length < 4) {
      points = DEFAULT_POINTS.map((p) => p.clone());
      dirty = true;
    }
  }

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  function setTouchDrawMode(on) {
    touchDrawMode = on;
    canvas.style.touchAction = on ? 'none' : 'pan-y';
    ui.drawBtn?.setAttribute('aria-pressed', String(on));
    ui.root?.classList.toggle('touch-draw', on);
  }

  const onDrawBtn = () => setTouchDrawMode(!touchDrawMode);
  const onReset = () => {
    points = DEFAULT_POINTS.map((p) => p.clone());
    idle = !reduced;
    dirty = true;
  };
  ui.drawBtn?.addEventListener('click', onDrawBtn);
  ui.resetBtn?.addEventListener('click', onReset);

  // ── Loop ────────────────────────────────────────────────────────────────
  let raf = 0;
  const swayPts = DEFAULT_POINTS.map((p) => p.clone());

  function loop(t) {
    raf = requestAnimationFrame(loop);

    if (idle) {
      // Gentle sway of the default shape, to show the bend is live
      const s = Math.sin(t * 0.0009);
      const c = Math.cos(t * 0.0007);
      swayPts[2].set(2 + s * 1.2, 11 + c * 0.6, 0);
      swayPts[3].set(7 + s * 1.5, 11 + c * 1.2 - s * 0.4, 0);
      swayPts[4].set(7 + s * 2.2, 7.5 + c * 1.4, 0);
      applyArm(swayPts);
    } else if (dirty) {
      applyArm(points);
      dirty = false;
    }

    renderer.render(scene, camera);
  }
  applyArm(points);
  raf = requestAnimationFrame(loop);

  return function dispose() {
    cancelAnimationFrame(raf);
    ro.disconnect();
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onUp);
    ui.drawBtn?.removeEventListener('click', onDrawBtn);
    ui.resetBtn?.removeEventListener('click', onReset);
    for (const d of toDispose) d.dispose();
    renderer.dispose();
  };
}
