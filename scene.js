import * as THREE from "three";

const canvas = document.querySelector("#studio");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 40);
camera.position.set(3.15, 2.45, 5.15);
camera.lookAt(0.05, 0.55, 0.05);

function material(color, roughness, metalness) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(9, 80),
  material(0xe6e4df, 1, 0)
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

const shadow = new THREE.Mesh(
  new THREE.CircleGeometry(9, 80),
  new THREE.ShadowMaterial({ opacity: 0.22 })
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = 0.004;
shadow.receiveShadow = true;
scene.add(shadow);

function shade(root) {
  root.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
}

function book() {
  const group = new THREE.Group();
  const pages = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.02, 0.18), material(0xd8d4cc, 0.94, 0));
  pages.position.set(0.03, 0.51, 0);
  const front = new THREE.Mesh(new THREE.BoxGeometry(0.76, 1.1, 0.028), material(0x1a1a1a, 0.76, 0.04));
  front.position.set(0.03, 0.55, 0.11);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.76, 1.1, 0.028), material(0x1a1a1a, 0.76, 0.04));
  back.position.set(0.03, 0.55, -0.11);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.045, 1.1, 0.25), material(0x9c4a32, 0.4, 0.45));
  spine.position.set(-0.35, 0.55, 0);
  group.add(pages, front, back, spine);
  group.rotation.y = -0.62;
  group.position.set(-1.2, 0, 0.02);
  return group;
}

function antenna() {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.07, 28), material(0xc8c4bc, 0.86, 0));
  base.position.y = 0.035;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.032, 1.48, 18), material(0x1a1a1a, 0.62, 0.08));
  pole.position.y = 0.78;
  const coil = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 10, 28), material(0x9c4a32, 0.38, 0.5));
  coil.rotation.x = Math.PI / 2;
  coil.position.y = 0.46;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.075, 22, 16), material(0x9c4a32, 0.36, 0.5));
  cap.position.y = 1.56;
  group.add(base, pole, coil, cap);
  group.position.set(0.2, 0, -0.95);
  return group;
}

function crate() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.58, 0.76), material(0x1a1a1a, 0.8, 0.03));
  body.position.y = 0.29;
  const band = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.055, 0.78), material(0x9c4a32, 0.42, 0.4));
  band.position.y = 0.38;
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.04, 0.76), material(0xcfcbc3, 0.9, 0));
  lid.position.y = 0.6;
  group.add(body, band, lid);
  group.rotation.y = 0.42;
  group.position.set(1.15, 0, 0.32);
  return group;
}

function plates() {
  const group = new THREE.Group();
  let y = 0;
  for (let i = 0; i < 4; i += 1) {
    const height = 0.065;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.82 - i * 0.05, height, 0.64 - i * 0.035),
      i === 3
        ? material(0x9c4a32, 0.4, 0.42)
        : material(i % 2 ? 0xc8c4bc : 0x1a1a1a, 0.84, 0.02)
    );
    y += i === 0 ? height / 2 : height / 2 + 0.03;
    mesh.position.y = y;
    mesh.rotation.y = (i - 1.5) * 0.07;
    y += height / 2;
    group.add(mesh);
  }
  group.rotation.y = -0.18;
  group.position.set(-0.15, 0, 0.92);
  return group;
}

const pieces = [
  { id: "quire", label: "Quire", mesh: book() },
  { id: "marconi", label: "Marconi", mesh: antenna() },
  { id: "wharf", label: "Wharf", mesh: crate() },
  { id: "galley", label: "Galley", mesh: plates() },
];

for (const piece of pieces) {
  piece.mesh.userData.id = piece.id;
  piece.baseY = piece.mesh.position.y;
  piece.lift = 0;
  shade(piece.mesh);
  scene.add(piece.mesh);

}

scene.add(new THREE.AmbientLight(0xfffaf6, 0.48));
scene.add(new THREE.HemisphereLight(0xf6f3ec, 0xb9b4aa, 0.42));

const key = new THREE.DirectionalLight(0xfff4ea, 2.7);
key.position.set(4.2, 7.4, 3.1);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 18;
key.shadow.camera.left = -4;
key.shadow.camera.right = 4;
key.shadow.camera.top = 4;
key.shadow.camera.bottom = -4;
key.shadow.bias = -0.0006;
scene.add(key);

const fill = new THREE.DirectionalLight(0xe6e2da, 0.5);
fill.position.set(-4.2, 2.6, -1.5);
scene.add(fill);

function resize() {
  const width = canvas.clientWidth || 320;
  const height = canvas.clientHeight || 240;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resize);

function frame() {
  for (const piece of pieces) {
    const target = piece.baseY + piece.lift;
    piece.mesh.position.y = reduced
      ? target
      : piece.mesh.position.y + (target - piece.mesh.position.y) * 0.16;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

resize();
frame();
