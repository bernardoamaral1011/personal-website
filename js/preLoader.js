/*
  preLoader.js

  a div is displayed and all others are hidden
  this div is a preloader and has a 3d scene with a icosaedro
  once all the website images are loaded this div is hidden and the homepage is displayed
*/

import gsap from "gsap";
import * as THREE from "three";

let camera, scene, renderer, mesh;
var imagesLoaded = require("imagesloaded");

hideLayers();
preLoader();
function preLoader() {
  init();
  animate();
}

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera.position.z = 15;

  let sphereGeometry = new THREE.IcosahedronBufferGeometry();
  let sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x0abab5,
    wireframe: false,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  });
  mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

  let wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000,
    wireframe: true,
    transparent: true,
  });
  let wireframe = new THREE.Mesh(sphereGeometry, wireframeMaterial);

  mesh.add(wireframe);
  scene.add(mesh);

  // Renderer 1 - no post processing!!!
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0); // the default
  renderer.setPixelRatio(window.devicePixelRatio); //hd
  renderer.setSize(window.innerWidth, window.innerHeight);
  let sublayer = document.getElementById("loader");
  sublayer.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  mesh.rotation.x += 0.008;
  mesh.rotation.y += 0.005;
  renderer.render(scene, camera);
}

const preloadImages = new Promise((resolve, reject) => {
  imagesLoaded(document.querySelectorAll("img"), { background: true }, resolve);
});

preloadImages.then(() => {
  // inits
  hideLayers();
  setTimeout(showPage, 1000);
});

function showPage() {
  gsap
    .timeline()
    .to(camera.position, { duration: 0.5, z: 0.95 }, 0)
    .set("#loader", { display: "none" })
    .set("#layer-1", { display: "block" })
    .to("#layer-3", { duration: 0.5, display: "block" }, 0.5)
    .to(camera.position, { duration: 0.5, z: 0.85 }, 0.6)
    .to("#layer-1", { duration: 0.5, scaleX: 1, scaleY: 1, ease: "expo" }, 0.6);
}

function hideLayers() {
  // Hide layer2 overflow in the first state
  gsap.set("#layer-3", { overflowY: "hidden" });
  gsap.set("#layer-1", { overflowY: "hidden" });
  gsap.set("#layer-1", { scaleX: 0, scaleY: 0 });
  // Hide elements of the second state-> this should be #layer2 -> auto alpha=1
  gsap.set("#projects-container", { autoAlpha: 0 });
  gsap.set("#goback", { autoAlpha: 0 });
}
