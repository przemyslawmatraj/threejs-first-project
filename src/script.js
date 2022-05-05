import "./style.css";
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  "https://bruno-simon.com/prismic/matcaps/8.png"
);

const MathFunction = (index) => {
  return 0.1 * index ** 2;
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Geometry
const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);
const planeGeometry = new THREE.PlaneGeometry(10, 10);

// Materials

const sphereMaterial = new THREE.MeshMatcapMaterial({
  matcap: texture,
});
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  side: THREE.DoubleSide,
  opacity: 0.2,
});

// Meshes

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

let spheres = [];
let spheres2 = [];
for (let index = 0; index < 8; index++) {
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.y = MathFunction(index - 7);
  sphere.position.x = index * 2 - 7;
  spheres = [...spheres, sphere];
  scene.add(sphere);
}
for (let index = 0; index < 8; index++) {
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.y = MathFunction(index - 7);
  sphere.position.z = index * 2 - 7;
  spheres2 = [...spheres2, sphere];
  scene.add(sphere);
}

// Lights

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
const pivot = new THREE.Object3D();
camera.position.z = 20;
pivot.add(camera);
scene.add(pivot);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  spheres.forEach((sph, index) => {
    sph.rotation.x = 1 * elapsedTime;
    sph.rotation.y = 1 * elapsedTime;
    sph.rotation.z = 1 * elapsedTime;
    sph.position.y = MathFunction(index - 3.5) * 7 * Math.sin(2 * elapsedTime);
  });
  spheres2.forEach((sph, index) => {
    sph.rotation.x = 1 * elapsedTime;
    sph.rotation.y = 1 * elapsedTime;
    sph.rotation.z = 1 * elapsedTime;
    sph.position.y =
      -1 * MathFunction(index - 3.5) * 7 * Math.sin(2 * elapsedTime);
  });

  pivot.rotation.y = elapsedTime;
  pivot.position.y = 0;
  camera.position.z = 15 + Math.sin(elapsedTime) * 5;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
