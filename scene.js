import * as THREE from "three";

const canvas = document.querySelector("#studio");
const hits = document.querySelector("#hits");
if (!canvas || !hits) throw new Error("studio markup missing");

const DESK_TOP = 0.795;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
camera.position.set(0.08, 2.55, 3.15);
camera.lookAt(0, 0.55, -0.05);

function mat(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.92,
    metalness: 0,
  });
}

const paper = () => mat(0xffffff);
const shell = () => mat(0xe8e8ed);
const line = () => mat(0xd2d2d7);
const ink = () => mat(0x1d1d1f);

function shade(root) {
  root.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
}

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.ShadowMaterial({ opacity: 0.14 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

function desk() {
  const group = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.07, 2.15), paper());
  top.position.y = 0.76;
  const leg = new THREE.BoxGeometry(0.06, 0.72, 1.9);
  const left = new THREE.Mesh(leg, shell());
  left.position.set(-0.86, 0.36, 0);
  const right = new THREE.Mesh(leg, shell());
  right.position.set(0.86, 0.36, 0);
  group.add(top, left, right);
  return group;
}

function laptop() {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.04, 0.84), shell());
  base.position.y = 0.02;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.008, 0.5), line());
  deck.position.set(0, 0.044, 0.06);
  const track = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.006, 0.13), paper());
  track.position.set(0, 0.05, 0.28);

  const lid = new THREE.Group();
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.82, 0.028), shell());
  bezel.position.y = 0.41;
  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.66, 0.01), ink());
  screen.position.set(0, 0.43, 0.018);
  const cursor = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.012, 0.006), paper());
  cursor.position.set(-0.4, 0.52, 0.026);
  lid.add(bezel, screen, cursor);
  lid.position.set(0, 0.04, -0.4);
  lid.rotation.x = -0.42;

  group.add(base, deck, track, lid);
  group.position.set(-0.08, DESK_TOP, -0.42);
  group.rotation.y = 0.12;
  group.scale.setScalar(0.82);
  return group;
}

function book() {
  const group = new THREE.Group();
  const pages = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.46), paper());
  pages.position.y = 0.035;
  const cover = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.016, 0.48), shell());
  cover.position.y = 0.078;
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 0.48), line());
  spine.position.set(-0.17, 0.045, 0);
  group.add(pages, cover, spine);
  group.rotation.y = 0.35;
  return group;
}

function ship() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.045, 0.26), paper());
  body.position.y = 0.045;
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.12, 4), paper());
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 0.045, -0.16);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.018, 0.09), shell());
  wing.position.set(0, 0.05, 0.02);
  group.add(body, nose, wing);
  group.rotation.y = 0.55;
  return group;
}

function plates() {
  const group = new THREE.Group();
  for (let i = 0; i < 3; i += 1) {
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.04, 0.24),
      i === 1 ? line() : paper()
    );
    slab.position.y = 0.02 + i * 0.055;
    slab.rotation.y = (i - 1) * 0.1;
    group.add(slab);
  }
  return group;
}

function mic() {
  const group = new THREE.Group();
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.02, 18), line());
  foot.position.y = 0.01;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 10), line());
  stem.position.y = 0.11;
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.1, 16), paper());
  head.position.y = 0.24;
  group.add(foot, stem, head);
  return group;
}

function lenses() {
  const group = new THREE.Group();
  function eye(x) {
    const eyeGroup = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 8, 22), line());
    const glass = new THREE.Mesh(new THREE.CircleGeometry(0.06, 20), paper());
    glass.position.z = 0.002;
    eyeGroup.add(ring, glass);
    eyeGroup.position.x = x;
    return eyeGroup;
  }
  group.add(eye(-0.095), eye(0.095));
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, 0.012), line());
  group.add(bridge);
  group.rotation.x = -1.05;
  group.position.y = 0.06;
  return group;
}

function card() {
  const group = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, 0.014), paper());
  board.position.y = 0.14;
  const rule = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.008, 0.006), line());
  rule.position.set(0, 0.18, 0.01);
  group.add(board, rule);
  group.rotation.y = -0.25;
  return group;
}

function withMark(mesh) {
  const group = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.008, 22), line());
  disc.position.y = 0.004;
  disc.userData.mark = true;
  group.add(disc, mesh);
  return group;
}

const specs = [
  { id: "quire", label: "Quire", mesh: book(), x: 0.42, z: 0.22 },
  { id: "invaders", label: "Space Invaders", mesh: ship(), x: -0.42, z: 0.62 },
  { id: "galley", label: "Galley", mesh: plates(), x: 0.42, z: 0.68 },
  { id: "transcribe", label: "TranscribeMate", mesh: mic(), x: 0.48, z: -0.22 },
  { id: "bifocal", label: "Bifocal", mesh: lenses(), x: -0.46, z: 0.12 },
  { id: "whodunit", label: "Whodunit", mesh: card(), x: -0.02, z: 0.38 },
];

const pieces = specs.map((spec) => {
  const object = withMark(spec.mesh);
  object.position.set(spec.x, DESK_TOP, spec.z);
  object.userData.id = spec.id;
  shade(object);
  scene.add(object);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "hit";
  button.setAttribute("aria-label", spec.label);
  button.addEventListener("click", () => choose(spec.id));
  hits.appendChild(button);
  return { id: spec.id, object, button };
});

const table = desk();
shade(table);
scene.add(table);
const machine = laptop();
shade(machine);
scene.add(machine);

scene.add(new THREE.AmbientLight(0xffffff, 0.72));
scene.add(new THREE.HemisphereLight(0xffffff, 0xf5f5f7, 0.38));

const key = new THREE.DirectionalLight(0xffffff, 0.62);
key.position.set(-3.4, 6.2, 3.6);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 16;
key.shadow.camera.left = -4;
key.shadow.camera.right = 4;
key.shadow.camera.top = 4;
key.shadow.camera.bottom = -4;
key.shadow.bias = -0.0006;
scene.add(key);

const fill = new THREE.DirectionalLight(0xffffff, 0.22);
fill.position.set(2.4, 2.2, -2.2);
scene.add(fill);

function choose(id) {
  for (const piece of pieces) {
    const on = piece.id === id;
    piece.object.traverse((node) => {
      if (node.userData.mark && node.material && node.material.color) {
        node.material.color.set(on ? 0x0071e3 : 0xd2d2d7);
      }
    });
  }
  document.querySelectorAll(".projects li").forEach((item) => {
    item.classList.toggle("is-current", item.id === id);
  });
  const entry = document.getElementById(id);
  if (!entry) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  entry.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  draw();
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const center = new THREE.Vector3();

function pieceFromHit(object) {
  let node = object;
  while (node && !node.userData.id) node = node.parent;
  return node ? node.userData.id : null;
}

function pointerOnCanvas(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

canvas.addEventListener("pointermove", (event) => {
  pointerOnCanvas(event);
  raycaster.setFromCamera(pointer, camera);
  const found = raycaster.intersectObjects(pieces.map((piece) => piece.object), true);
  canvas.style.cursor = found.length ? "pointer" : "default";
});

canvas.addEventListener("pointerleave", () => {
  canvas.style.cursor = "default";
});

canvas.addEventListener("click", (event) => {
  pointerOnCanvas(event);
  raycaster.setFromCamera(pointer, camera);
  const found = raycaster.intersectObjects(pieces.map((piece) => piece.object), true);
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
    piece.object.getWorldPosition(center);
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

const frame = canvas.parentElement;
if (frame && "ResizeObserver" in window) {
  new ResizeObserver(() => draw()).observe(frame);
}
window.addEventListener("resize", draw);
draw();
