/*
  bgLayer.js

  basic layer switching and animation
*/
import * as THREE from "three";
import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import EffectComposer, {
  RenderPass,
  ShaderPass,
} from '@johh/three-effectcomposer';

// setup
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(TextPlugin);
let camera, scene, light, renderer, composer, renderPass, customPass, mesh;
let uMouse = new THREE.Vector2();
let myEffect = {
  uniforms: {
    "tDiffuse": { value: null },
    "resolution": { value: new THREE.Vector2(1.,window.innerHeight/window.innerWidth) },
    "uMouse": { value: new THREE.Vector2(-1,-1) },
    "uVelo": { value: 0 },
  },
  vertexShader: `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );}`,
  fragmentShader: `uniform float time;
  uniform sampler2D tDiffuse;
  uniform vec2 resolution;
  varying vec2 vUv;
  uniform vec2 uMouse;
  float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
    uv -= disc_center;
    uv*=resolution;
    float dist = sqrt(dot(uv, uv));
    return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
  }
  void main()  {
      vec2 newUV = vUv;
      float c = circle(vUv, uMouse, 0.0, 0.2);
      float r = texture2D(tDiffuse, newUV.xy += c * (0.1 * .5)).x;
      float g = texture2D(tDiffuse, newUV.xy += c * (0.1 * .525)).y;
      float b = texture2D(tDiffuse, newUV.xy += c * (0.1 * .55)).z;
      vec4 color = vec4(r, g, b, 1.);

      gl_FragColor = color;
  }`
}
let initCamY;

// 3d renderer setup
init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );
  camera.position.z = 0.85;
  initCamY = camera.position.y;
  
  //light = new THREE.DirectionalLight( 0xffffff );
  //light.position.set( 0, 0, 1 );
  //scene.add( light );
  
  let sphereGeometry = new THREE.IcosahedronBufferGeometry();
  let sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x0abab5, wireframe: false, transparent: true, opacity: 1, side: THREE.DoubleSide} );
  mesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
  
  let wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000, wireframe: true, transparent: true } );
  let wireframe = new THREE.Mesh( sphereGeometry, wireframeMaterial );
  
  mesh.add( wireframe );
  scene.add( mesh );

  // Renderer 1 - no post processing!!!
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio); //hd
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  let sublayer = document.getElementById("layer-2");
  sublayer.appendChild(renderer.domElement);

  // Post Processing
  // composer = new EffectComposer(renderer);
  // renderPass = new RenderPass(scene, camera);
  // composer.addPass(renderPass);
  // customPass = new ShaderPass(myEffect);
  // customPass.renderToScreen = true;
  // composer.addPass(customPass);

  // Global Event Listeners
  document.addEventListener("mousemove", onDocumentMouseMove, false);
  // window.addEventListener("scroll", onMouseWheel, { passive: false }, false);
  window.addEventListener("resize", onWindowResize, false);
}

//default
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//default
function onDocumentMouseMove(e) {
  event.preventDefault();
  uMouse.x = ( e.clientX / window.innerWidth ) ;
  uMouse.y = 1. - ( e.clientY/ window.innerHeight );
}

// // /quocient must be changed depending on mesh reach, should also be proportional to scroll speed
// function onMouseWheel(event) {
//   event.preventDefault();
//   gsap.to(mesh.position, {duration:1.5, y: initCamY - window.scrollY / 103})
//   gsap.set(camera.position, {y: initCamY - window.scrollY / 103 });
// }

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  mesh.rotation.x += 0.008;
  mesh.rotation.y += 0.005;
  //customPass.uniforms.uMouse.value = uMouse;
  //composer.render();
  renderer.render(scene, camera);
}

// mega animations: everything fades away as layer-1 converges to the center and reverse
let discover = gsap.timeline({paused: true})
.set("#layer-3", {overflow: "initial", height:"400%"})
.to("#layer-1", {duration:0.5, scaleX:0, scaleY:0, ease: "expo"}, 0)
.to(camera.position, {duration: 0.5, z:1}, 0)
.to(camera.position, {duration: 1, z: 15}, 0.5)
.to("#projects-container", {duration:0.5, autoAlpha:1}, 1.5)
.set("#goback", {autoAlpha:1}, 1.5);

let undiscover = gsap.timeline({paused: true})
.set("#projects-container", {autoAlpha:0}, 0)
.set("#goback", { autoAlpha:0}, 0)
.fromTo(window, {scrollTo:{y:window.scrollY}}, {duration:0.5, scrollTo:{y:0}}, 0.5)
.set("#layer-3", {overflow: "hidden", height:"0%"}, 0.8)
.to(camera.position, {duration: 0.5, z: 0.85}, 0.5)
.to("#layer-1", {duration:0.5, scaleX:1, scaleY:1, ease: "expo"}, 1.1);


// open and close projects layer
let openProjects = document.getElementById("projects-button");
let closeProjects = document.getElementById("goback");

openProjects.addEventListener('click', () => {
  discover.play(0);
  document.getElementById("layer-3").style.zIndex = 1;
});

closeProjects.addEventListener('click', () => {
  document.getElementById("layer-3").style.zIndex = -98;
  undiscover.play(0);
});