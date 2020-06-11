import gsap from "gsap";
import TextPlugin from "gsap/TextPlugin";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

gsap.registerPlugin(TextPlugin);

let openProjects = document.getElementById("projects-button");
console.log(openProjects);

let hoverProjects = gsap.timeline({paused:true})
.set("#projects-button",  {width: "750px"})
.to("#projects-button", {duration:1, text: "This seems a bit dull. Lets change that and check some fun projects!", color:"#66C0DA"});

let hoverProjectsNormal = gsap.timeline({paused:true})
.to("#projects-button", {duration:1, text: "Projects", color:"#000"})
.set("#projects-button",  {width: "60px"}, 1);

openProjects.addEventListener('mouseenter', () => {
  hoverProjectsNormal.totalProgress(0).kill();
  hoverProjects.play(0);
});

openProjects.addEventListener('mouseleave', () => {
  hoverProjects.totalProgress(1).kill();
  hoverProjectsNormal.play(0);
});


// mega animation: everything fades away as layer-1 converges to the center
let discover = gsap.timeline({paused: true})
.to("#layer-1", {duration:0.2, borderTopLeftRadius:1020})
.to("#layer-1", {duration:0.2, scaleX:0.5, scaleY:0.4}, 0.1)
.to("#layer-1", {duration:0.2, borderTopRightRadius:1020}, 0.2)
.to("#layer-1", {duration:0.2, scaleX:0.2, scaleY:0.3}, 0.3)
.to("#layer-1", {duration:0.2, borderBottomRightRadius:1020}, 0.4)
.to("#layer-1", {duration:0.2, scaleX:0.1, scaleY:0.05}, 0.5)
.to("#layer-1", {duration:0.2, borderBottomLeftRadius:1020}, 0.6)
.to("#layer-1", {duration:0.2, scaleX:0.05}, 0.7);


openProjects.addEventListener('click', () => {
  discover.play(0);
});


// threejs layer

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

var controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();

function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( scene, camera );

}