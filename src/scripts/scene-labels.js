import * as THREE from 'three';

// Floating HTML labels pinned to world-space points.
// The container must be the positioned element that wraps the canvas.
export function createSceneLabels(container, camera, items) {
  const layer = document.createElement('div');
  layer.className = 'scene-labels';
  layer.setAttribute('aria-hidden', 'true');
  container.appendChild(layer);

  const v = new THREE.Vector3();
  const labels = items.map(({ text, position }) => {
    const el = document.createElement('span');
    el.className = 'scene-label';
    el.textContent = text;
    layer.appendChild(el);
    return { el, position: position.clone() };
  });

  function update() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    for (const l of labels) {
      v.copy(l.position).project(camera);
      const hidden = v.z > 1 || v.x < -1.1 || v.x > 1.1 || v.y < -1.1 || v.y > 1.1;
      l.el.style.opacity = hidden ? '0' : '';
      l.el.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, -100%)`;
    }
  }

  function setPosition(index, position) {
    labels[index]?.position.copy(position);
  }

  return {
    update,
    setPosition,
    dispose: () => layer.remove(),
  };
}
