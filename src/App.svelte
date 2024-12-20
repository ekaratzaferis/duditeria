<script>
  import * as THREE from 'three';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let camera, scene, renderer, material;
  let mouseX = 0, mouseY = 0;

  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  async function init() {

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000 );
    camera.position.z = 1300;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const sprite = new THREE.TextureLoader().load('/logo-wave.png');
    sprite.colorSpace = THREE.SRGBColorSpace;

    for ( let i = 0; i < 3000; i ++ ) {
      const x = 2000 * Math.random() - 1000;
      const y = 2000 * Math.random() - 1000;
      const z = 2000 * Math.random() - 1000;
      vertices.push( x, y, z );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    material = new THREE.PointsMaterial({ size: 35, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );
    material.color.setHSL( 1.0, 0.3, 0.7, THREE.SRGBColorSpace );

    const particles = new THREE.Points( geometry, material );
    scene.add(particles);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.getElementById('three-container').appendChild( renderer.domElement );

    document.body.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onWindowResize );
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function onPointerMove( event ) {
    if (event.isPrimary === false) return;

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  }

  function animate() {
    render();
  }

  function render() {
    const time = Date.now() * 0.00005;
    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
    camera.lookAt(scene.position);

    const h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
    material.color.setHSL( h, 0.5, 0.5 );

    renderer.render(scene, camera);
  }

  onMount(init);

  function contact() {
    const email = 'ekaratzaferis@gmail.com';
    const subject = 'My awesome idea!';
    const body = 'Let us know how we can help you';

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const anchor = document.createElement('a'); 
    anchor.href = mailtoLink;
    anchor.target = '_blank'; // Attempt to open in a new tab
    document.body.appendChild(anchor); 
    anchor.click();
    document.body.removeChild(anchor); 
  }

  const images = [
    'node.png',
    'svelte.webp',
    'three.png',
    'aws.png',
    'chat.webp',
    'react.webp',
    'mongo.webp',
    'docker.png'
  ];

  let currentImage = 0;
  const interval = 2000; // 5 seconds

  onMount(() => {
    const intervalId = setInterval(() => {
      currentImage = (currentImage + 1) % images.length;
    }, interval);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  });

  class MouseSimulator {
    constructor(maxWidth = window.innerWidth, maxHeight = window.innerHeight) {
      this.maxWidth = maxWidth;
      this.maxHeight = maxHeight;
      this.currentX = maxWidth / 2;  // Start at center
      this.currentY = maxHeight / 2;
      this.velocityX = 0;
      this.velocityY = 0;
      
      // Movement settings
      this.maxSpeed = 10;          // Maximum pixels per move
      this.inertia = 100;         // How much previous velocity affects next move
      this.randomness = 0.3;      // How much random movement to add
      this.edgeBoundary = 50;     // Stay this many pixels away from edges
    }

    getNextPosition() {
      // Apply inertia to current velocity
      this.velocityX *= this.inertia;
      this.velocityY *= this.inertia;
      
      // Add random movement
      this.velocityX += (Math.random() - 0.5) * this.maxSpeed * this.randomness;
      this.velocityY += (Math.random() - 0.5) * this.maxSpeed * this.randomness;
      
      // Limit speed
      const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
      if (speed > this.maxSpeed) {
        this.velocityX = (this.velocityX / speed) * this.maxSpeed;
        this.velocityY = (this.velocityY / speed) * this.maxSpeed;
      }
      
      // Update position
      this.currentX += this.velocityX;
      this.currentY += this.velocityY;
      
      // Keep cursor within bounds
      if (this.currentX < this.edgeBoundary) {
        this.currentX = this.edgeBoundary;
        this.velocityX *= -0.5;  // Bounce off edge
      } else if (this.currentX > this.maxWidth - this.edgeBoundary) {
        this.currentX = this.maxWidth - this.edgeBoundary;
        this.velocityX *= -0.5;
      }
      
      if (this.currentY < this.edgeBoundary) {
        this.currentY = this.edgeBoundary;
        this.velocityY *= -0.5;
      } else if (this.currentY > this.maxHeight - this.edgeBoundary) {
        this.currentY = this.maxHeight - this.edgeBoundary;
        this.velocityY *= -0.5;
      }
      
      return {
        x: Math.round(this.currentX),
        y: Math.round(this.currentY)
      };
    }
  }

  onMount(() => {
    const magicMouse = new MouseSimulator();

    setInterval(() => {
      const next = magicMouse.getNextPosition();
      onPointerMove({
        isPrimary: true,
        clientX: next.x,
        clientY: next.y
      })
    }, 100);
  })

</script>

<div id="logo-wrapper" on:click={contact}>
  <div id="logo"><img src="/logo-wave.png" alt="Duditeria Logo"></div>
  <!-- <div>Duditeria</div> -->
</div>
<div id="three-container"></div>
<div class="container">
  <div id="title"><h1>Duditeria</h1></div>
  <div id="animation">
    <div id="cta" on:click={contact}>You name it, we build it!</div>
    <div id="image-container">
      {#each images as image, index}
        {#if index === currentImage}
          <img src={image} alt="Image {index + 1}" transition:fade={{ duration: 1000 }} />
        {/if}
      {/each}
    </div>
  </div>
</div>
<div id="copyright">Copyright © {new Date().getFullYear()} Duditeria. All rights reserved.</div>

<style>

  #title {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 30vh;
    align-items: center;
    justify-content: center;
  }

  #title h1 {
    margin-bottom: 0;
  }

  @media screen and (orientation: portrait) {
    #title h1 {
      margin-bottom: 0;
      font-size: 5rem;
    }
    #cta {
      font-size: 2rem;
    }
    #animation {
      flex-direction: column;
    }
  }

  @media screen and (orientation: landscape) {
    #title h1 {
      margin-bottom: 0;
      font-size: 8rem;
    }
    #cta {
      font-size: 3rem;
    }
    #animation {
      flex-direction: row;
    }
    #image-container img {
      margin-top: -10px;
    }
    #image-container {
      margin-left: 1.5rem;
    }
  }

  #animation {
    display: flex;
    width: 100%;
    height: 10vh;
    align-items: center;
    justify-content: center;
  }

  .container {
    /* Adjust styling as needed */
    overflow: hidden;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 90%;
  }

  #cta {
    text-align: center;
    cursor: pointer;
    margin-bottom: 1rem;
  }

  #image-container {
    display: flex;
    height: 10vh;
    align-items: center;
    width: 60px;
    margin-left: 1.5rem;
  }

  #image-container img {
    height: 60px;
    z-index: 10;
    position: absolute;
  }

  #logo-wrapper {
    position: absolute;
    top: 2rem;
    left: 2rem;
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.2rem;
    cursor: pointer;
  }
  #logo {
    background: rgba(145,98,172, 0);
    width: 3rem;
    height: 3rem;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
  #logo img {
    width: 5rem;
    height: 5rem;
  }
  #copyright {
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  #three-container {
    width: 100%; 
    height: 100%;
    overflow: hidden;
  }

  :global(canvas) {
      display: block;
  }

  :global(.content) {
    width: 100px; 
    height: 100px; 
    background-color: white; /* Or any visible color */
    border: 1px solid black; /* Optional, for debugging */
    z-index: 10;
    pointer-events: none;
  }
</style>
