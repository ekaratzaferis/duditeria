import * as THREE from 'three';
import * as flexy from 'flexy-bend';

export function initFlexyEngine(canvas) {
  let scene, camera, renderer, lampGroup;

  // --- 1. SCENE & RENDERER ---
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // --- 2. CAMERA ---
  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(-20, 15, 25);
  camera.lookAt(0, 5, 0);

  // --- 3. LIGHTING ---
  // Debug Ambient Light - faint enough to keep it dark but visible
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  // Hidden top light to catch the edges of the lamp
  const topLight = new THREE.SpotLight(0xffffff, 800);
  topLight.position.set(-20, 30, 0);
  scene.add(topLight);

  const metalMat = new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 50 });

  function renderLamp(givenCurve) {

    if (givenCurve) scene.remove(lampGroup);

    // --- 4. THE LAMP ---
    lampGroup = new THREE.Group();
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) lampGroup.position.set(3, 0, -10);
    else lampGroup.position.set(-12, 0, 0);
    scene.add(lampGroup);

    // Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.2, 0.5, 32), metalMat);
    base.position.y = 0.25;
    base.castShadow = true;
    lampGroup.add(base);

    // The Curve (Tube)
    const curve = givenCurve || new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 8, 0),
      new THREE.Vector3(2, 11, 0),
      new THREE.Vector3(7, 11, 0), // Ends where the cone starts
      new THREE.Vector3(7, 7, 0) // Ends where the cone starts
    ]);
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 20, 32, 32), metalMat);
    tube.castShadow = true;

    flexy.bend({
      THREE,
      curve,
      orientation: new THREE.Vector3(0, 0, 1),
      bufferGeometry: tube.geometry,
      axis: 'y', // the axis the geometry is elongated along
      mode: 'fit'
    });
    lampGroup.add(tube);

    // The Head (Cone)
    const coneRadius = 3;
    const coneHeight = 4.5;
    const headGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 32, 1, true);
    const head = new THREE.Mesh(headGeo, metalMat);

    const lastPoint = curve.getPoint(1);    // The x, y, z coordinates at the very end
    const tangent = curve.getTangent(1);    // The direction vector the tube is pointing
    head.position.copy(lastPoint);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, -1, 0), 
        tangent
    );
    head.setRotationFromQuaternion(quaternion);
    head.geometry.translate(0, -coneHeight * 0.4, 0);
    
    head.castShadow = true;
    lampGroup.add(head);

    // --- 5. REALISTIC SPOTLIGHT (Aligned with Head) ---
    const spotLight = new THREE.SpotLight(0xffaa44, 200);

    // 1. Position at the pointy tip 
    // In local cone space, the tip is at +coneHeight/2
    console.log(coneHeight)
    spotLight.position.set(0, -0.4, 0); 

    // 2. Set the spread angle
    spotLight.angle = Math.PI / 2; 
    spotLight.penumbra = 1;
    spotLight.decay = 1.7;
    spotLight.distance = 80;
    spotLight.castShadow = true;

    // 3. Create a target situated "in front" of the cone opening
    // Since the opening is at the -Y bottom of the cone, we place the target further down -Y
    const target = new THREE.Object3D();
    target.position.set(0, -50, 0); // Pointing deep out of the cone base
    head.add(target);

    spotLight.target = target;
    head.add(spotLight);
  }

  // --- 6. ENVIRONMENT ---
  const terrain = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 20, 20),
    new THREE.MeshPhongMaterial({ color: 0x111111, flatShading: true })
  );
  terrain.rotation.x = -Math.PI / 2;
  terrain.receiveShadow = true;
  scene.add(terrain);

  renderLamp();

  const bendBtn = document.createElement('button');
  bendBtn.textContent = 'Bend';
  Object.assign(bendBtn.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '10px 24px', fontSize: '14px', fontFamily: 'monospace',
    background: '#ffffff', color: '#000000', border: 'none',
    borderRadius: '4px', cursor: 'pointer', zIndex: '10',
    userSelect: 'none', letterSpacing: '0.08em',
  });
  document.body.appendChild(bendBtn);

  const hint = document.createElement('div');
  hint.textContent = 'Draw the arm shape — bottom to top';
  Object.assign(hint.style, {
    position: 'fixed', bottom: '70px', right: '24px',
    fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)',
    display: 'none', pointerEvents: 'none', zIndex: '10', letterSpacing: '0.05em',
  });
  document.body.appendChild(hint);

  const drawCanvas = document.createElement('canvas');
  drawCanvas.width = window.innerWidth;
  drawCanvas.height = window.innerHeight;
  Object.assign(drawCanvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    display: 'none', cursor: 'crosshair',
    zIndex: '9', touchAction: 'none',
  });
  document.body.appendChild(drawCanvas);
  const drawCtx = drawCanvas.getContext('2d');

  let bendMode = false;
  let drawing  = false;
  let drawnPts = [];

  bendBtn.addEventListener('click', () => {
    bendMode = !bendMode;
    drawCanvas.style.display = bendMode ? 'block' : 'none';
    hint.style.display       = bendMode ? 'block' : 'none';
    bendBtn.style.background = bendMode ? '#ffe066' : '#ffffff';
    if (!bendMode) drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  });

  function evtPos(e) {
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX, y: src.clientY };
  }

  drawCanvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    drawing  = true;
    drawnPts = [evtPos(e)];
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  });

  drawCanvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    drawnPts.push(evtPos(e));
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    if (drawnPts.length < 2) return;
    drawCtx.save();
    drawCtx.strokeStyle = 'rgba(255,230,80,0.9)';
    drawCtx.lineWidth   = 3;
    drawCtx.lineJoin    = 'round';
    drawCtx.lineCap     = 'round';
    drawCtx.beginPath();
    drawCtx.moveTo(drawnPts[0].x, drawnPts[0].y);
    for (let i = 1; i < drawnPts.length; i++) drawCtx.lineTo(drawnPts[i].x, drawnPts[i].y);
    drawCtx.stroke();
    drawCtx.restore();
  });

  drawCanvas.addEventListener('pointerup', () => {
    if (!drawing) return;
    drawing = false;
    if (drawnPts.length >= 4) applyDrawnCurve(drawnPts);
    bendMode = false;
    drawCanvas.style.display = 'none';
    hint.style.display       = 'none';
    bendBtn.style.background = '#ffffff';
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  });

  function applyDrawnCurve(pts) {
    pts.pop();
    pts.pop();
    if (!pts || pts.length === 0) return;

    // 1. Capture the start point (the anchor)
    const originX = pts[0].x;
    const originY = pts[0].y;

    // 2. Determine scale factor
    // We want the largest dimension to be roughly 10-11 units
    const rawWidth = Math.max(...pts.map(p => Math.abs(p.x - originX)));
    const rawHeight = Math.max(...pts.map(p => Math.abs(p.y - originY)));
    const maxDimension = Math.max(rawWidth, rawHeight) || 1;
    
    const scaleTarget = 11; 
    const multiplier = scaleTarget / maxDimension;

    // 3. Transform points
    const points = pts.map(p => {
        // Subtract origin to start at 0,0
        let relX = p.x - originX;
        let relY = p.y - originY;

        // INVERT Y: In screen space, Y increases downwards. 
        // We negate it so that drawing "up" results in positive Y values.
        relY = -relY;

        // Apply scale
        return new THREE.Vector3(
            relX * multiplier,
            relY * multiplier,
            0
        );
    });

    const newCurve = new THREE.CatmullRomCurve3(points, false);
    renderLamp(newCurve);
  }

  // --- ANIMATION ---
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  const ro = new ResizeObserver(() => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  });
  ro.observe(canvas);

  animate();
}
