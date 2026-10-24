import * as THREE from "three";

const canvas = document.querySelector("#studio");
const hits = document.querySelector("#hits");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 40);
camera.position.set(4.4, 3.15, 7.4);
camera.lookAt(0.05, 0.72, 0.05);

function material(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.94,
    metalness: 0,
  });
}

const white = () => material(0xffffff);
const mist = () => material(0xe8e8ed);
const line = () => material(0xd2d2d7);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80),
  new THREE.ShadowMaterial({ opacity: 0.16 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0.001;
floor.receiveShadow = true;
scene.add(floor);

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
  const pages = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.02, 0.18), white());
  pages.position.set(0.03, 0.51, 0);
  const front = new THREE.Mesh(new THREE.BoxGeometry(0.76, 1.1, 0.028), mist());
  front.position.set(0.03, 0.55, 0.11);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.76, 1.1, 0.028), mist());
  back.position.set(0.03, 0.55, -0.11);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.045, 1.1, 0.25), line());
  spine.position.set(-0.35, 0.55, 0);
  group.add(pages, front, back, spine);
  group.rotation.y = -0.62;
  group.position.set(-1.2, 0, 0.02);
  return group;
}

function antenna() {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.07, 28), white());
  base.position.y = 0.035;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.032, 1.48, 18), line());
  pole.position.y = 0.78;
  const coil = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 10, 28), mist());
  coil.rotation.x = Math.PI / 2;
  coil.position.y = 0.46;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.075, 22, 16), white());
  cap.position.y = 1.56;
  group.add(base, pole, coil, cap);
  group.position.set(0.2, 0, -0.95);
  return group;
}

function crate() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.58, 0.76), mist());
  body.position.y = 0.29;
  const band = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.055, 0.78), line());
  band.position.y = 0.38;
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.04, 0.76), white());
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
      i % 2 ? line() : white()
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
  shade(piece.mesh);
  scene.add(piece.mesh);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "hit";
  button.setAttribute("aria-label", piece.label);
  button.addEventListener("click", () => choose(piece.id));
  button.addEventListener("focus", () => choose(piece.id));
  hits.appendChild(button);
  piece.button = button;
}

scene.add(new THREE.AmbientLight(0xffffff, 0.82));
scene.add(new THREE.HemisphereLight(0xffffff, 0xf5f5f7, 0.4));

const key = new THREE.DirectionalLight(0xffffff, 0.48);
key.position.set(3.2, 8.4, 4.2);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 18;
key.shadow.camera.left = -4;
key.shadow.camera.right = 4;
key.shadow.camera.top = 4;
key.shadow.camera.bottom = -4;
key.shadow.bias = -0.0008;
scene.add(key);

function choose(id) {
  const entry = document.getElementById(id);
  if (entry) entry.scrollIntoView({ behavior: "auto", block: "center" });
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function pieceFromHit(object) {
  let node = object;
  while (node && !node.userData.id) node = node.parent;
  return node ? node.userData.id : null;
}

canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const found = raycaster.intersectObjects(pieces.map((piece) => piece.mesh), true);
  canvas.style.cursor = found.length ? "pointer" : "default";
});

canvas.addEventListener("pointerleave", () => {
  canvas.style.cursor = "default";
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const found = raycaster.intersectObjects(pieces.map((piece) => piece.mesh), true);
  const id = found.length ? pieceFromHit(found[0].object) : null;
  if (id) choose(id);
});

function resize() {
  const width = canvas.clientWidth || 320;
  const height = canvas.clientHeight || 240;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function placeButtons() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  for (const piece of pieces) {
    const center = new THREE.Box3().setFromObject(piece.mesh).getCenter(new THREE.Vector3());
    center.project(camera);
    piece.button.style.left = `${(center.x * 0.5 + 0.5) * width}px`;
    piece.button.style.top = `${(-center.y * 0.5 + 0.5) * height}px`;
  }
}

function draw() {
  resize();
  renderer.render(scene, camera);
  placeButtons();
}

window.addEventListener("resize", draw);
draw();
