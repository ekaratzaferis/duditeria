<script>
  import * as THREE from 'three';
  import { onMount } from 'svelte';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import Frontend from './lib/frontend.svelte';

  let scene, camera, renderer, cube, controls;

  onMount(() => {
    // Scene Setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();

    // Get container element and append renderer
    const container = document.getElementById('three-container');
    container.appendChild(renderer.domElement); 
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Add a Cube - Create 6 planes (front, back, left, right, top, bottom)
    const planeSize = 10;
    const planes = [];
    const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }); 

    for (let i = 0; i < 6; i++) {
      const plane = new THREE.Mesh(planeGeometry, material);
      planes.push(plane);
      scene.add(plane);
    }

    planes[0].position.z = planeSize / 2; // Front
    planes[1].position.z = -planeSize / 2; // Back
    planes[2].position.x = -planeSize / 2; // Left
    planes[2].rotation.y = Math.PI / 2;
    planes[3].position.x = planeSize / 2; // Right
    planes[3].rotation.y = -Math.PI / 2;
    planes[4].position.y = planeSize / 2; // Top
    planes[4].rotation.x = -Math.PI / 2;
    planes[5].position.y = -planeSize / 2; // Bottom
    planes[5].rotation.x = Math.PI / 2;

    const boxCenterX = planeSize / 2;
    const boxCenterY = planeSize / 2;
    const boxCenterZ = planeSize / 2;

    // Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = Math.min(boxCenterX, boxCenterY, boxCenterZ) * 0.9; // Limit max zoom out
    controls.minDistance = 0.1; // Limit min zoom in

    // Camera Positioning
    camera.position.set(boxCenterX + 0.01, boxCenterY, boxCenterZ); // Tiny offset along the X-axis
    const target = new THREE.Vector3(boxCenterX - 2, boxCenterY - 2, boxCenterZ - 2); // Adjust values for different views
    camera.lookAt(target);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white ambient light
    scene.add(ambientLight);

    // Resize handling
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize, false);

    const planeComponents = [
      document.getElementById("front")
    ];
    function positionSvelteComponents() {
      for (let i = 0; i < planeComponents.length; i++) {

        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(planes[i].matrixWorld);
        vector.project(camera);
  
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
  
        planeComponents[i].style.left = x + "px";
        planeComponents[i].style.top = y + "px";
      }
    }

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      positionSvelteComponents();
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  });
</script>

<div id="logo-wrapper">
  <div id="logo"><img src="/logo-trans.png" alt="Duditeria Logo"></div>
  <div>Duditeria</div>
</div>
<div id="three-container"></div>
<Frontend />

<style>
  #logo-wrapper {
    position: absolute;
    top: 2rem;
    left: 2rem;
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.2rem;
  }
  #logo {
    background: rgba(145,98,172,255);
    width: 65px;
    height: 65px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
  #logo img {
    width: 50px;
    height: 50px;
  }

  #three-container {
    width: 100%; 
    height: 100%;
  }
</style>
