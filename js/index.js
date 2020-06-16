import "../css/styles.css";
import "./bgLayer";
import gsap from "gsap";

// inits
hideLayers();
setAnimations();


// Hide second and third layers
function hideLayers(){
  // Hide layer2 overflow in the first state
  gsap.set("#layer-3", {overflowY: "hidden"});

  // Hide elements of the second state-> this should be #layer2 -> auto alpha=1
  gsap.set("#projects-container" , {autoAlpha:0});
  gsap.set("#goback", {autoAlpha:0});
}
// Simple Animations
function setAnimations(){
  let openProjects = document.getElementById("projects-button");
  let closeProjects = document.getElementById("goback");
  
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
}

