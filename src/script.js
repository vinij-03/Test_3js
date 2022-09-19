import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import CannonDebugger from 'cannon-es-debugger'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import * as dat from 'lil-gui'


//Creating three and cannon world-------------------------------
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene()
const world = new CANNON.World({
  restitution: -10000,
});
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;
world.solver.tolerance = 0.001;
world.solver.iterations = 10;


const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 10,
    // restitution:-1,
  }
);
world.defaultContactMaterial = defaultContactMaterial;

//Helpers
// const helper= new CannonHelper(this.scene);
const cannonDebugger = new CannonDebugger(scene, world, {
  color: 0xffff,
  
})
const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper( 10000, 1000 );
scene.add( gridHelper );

//skybox
const loader2 = new THREE.CubeTextureLoader()
const texture = loader2.load([
    'posx.jpg',
    'negx.jpg',
    'posy.jpg',
    'negy.jpg',
    'posz.jpg',
    'negz.jpg'
])
scene.background = texture

//camera
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(1, 1, 15);

//renderer and resize

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#35363a");
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});


// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(10, 0, 25);
scene.add(light);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


// Physics

// WALLS

// north Wall
// const wallN = new THREE.Mesh(
// 	new THREE.BoxGeometry(50, 10, 2),
// 	new THREE.MeshStandardMaterial({
// 	  color: 0x00ff,
// 	  metalness: 0.3,
// 	  roughness: 0.4,
// 	//   envMap: environmentMapTexture,
// 	  envMapIntensity: 0.5,
// 	})
//   );
//   wallN.position.set(-25, 5, 0);
//   wallN.receiveShadow = true;
//   wallN.rotation.y = Math.PI * 0.5;
//   scene.add(wallN);
//   //physics
//   const wallNShape = new CANNON.Box(new CANNON.Vec3(25, 5, 2));
//   const wallNBody = new CANNON.Body();
//   wallNBody.mass = 0;
//   wallNBody.addShape(wallNShape);
//   wallNBody.position.set(-25, 5, 0);
//   wallNBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI*0.5);
//   world.addBody(wallNBody);
  
//   //south wall
//   const wallS = new THREE.Mesh(
// 	new THREE.BoxGeometry(50, 10, 0.1),
// 	new THREE.MeshStandardMaterial({
// 	  color: 0x00ff00,
// 	  metalness: 0.3,
// 	  roughness: 0.4,
// 	//   envMap: environmentMapTexture,
// 	  envMapIntensity: 0.5,
// 	})
//   );
//   wallS.position.set(25, 5, 0);
//   wallS.receiveShadow = true;
//   wallS.rotation.y = Math.PI * 0.5;
//   scene.add(wallS);
  
  //physics
//   const wallSShape = new CANNON.Box(new CANNON.Vec3(25, 5, 0.1));
//   const wallSBody = new CANNON.Body();
//   wallSBody.mass = 0;
//   wallSBody.position.set(25,5,0)
//   wallSBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * 0.5)
//   wallSBody.addShape(wallSShape);
//   world.addBody(wallSBody);
  
//   //east wall
//   const wallE = new THREE.Mesh(
// 	new THREE.BoxGeometry(10, 50, 0.1),
// 	new THREE.MeshStandardMaterial({
// 	  color: 0xf0ff0f,
// 	  metalness: 0.3,
// 	  roughness: 0.4,
// 	//   envMap: environmentMapTexture,
// 	  envMapIntensity: 0.5,
// 	})
//   );
//   wallE.position.set(0, 5, -25);
//   wallE.receiveShadow = true;
//   wallE.rotation.z = Math.PI * 0.5;
//   scene.add(wallE);
  
//   //physics
//   const wallEShape = new CANNON.Box(new CANNON.Vec3(5, 25, 0.1));
//   const wallEBody = new CANNON.Body();
//   wallEBody.mass = 0;
//   wallEBody.position.set(0,5,-25)
//   wallEBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI * 0.5)
//   wallEBody.addShape(wallEShape);
//   world.addBody(wallEBody);

//
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(10, 0.1, 10),
  new THREE.MeshStandardMaterial({ color: 0x35363a })
);
floor.position.y = -0.05;
floor.receiveShadow = true;
scene.add(floor);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape,
  material: defaultContactMaterial
});
// floorBody.position.set(0,3,0)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
world.addBody(floorBody);




// Load Model
const Avatar = "../public/Soldier.glb"; //?Dynamic character selection
let animations, model;
let modelBody;
const velocity = 0.5;
let character = new GLTFLoader().load(Avatar, function (gltf) {
  model = gltf.scene;
  model.traverse(function (object) {
    if (object.isMesh) object.castShadow = true;
  });
  gltf.scene.scale.set(3, 3, 3), scene.add(model);

  const modelShape = new CANNON.Sphere(2);
  modelBody = new CANNON.Body({
    mass: 1,
    shape: modelShape,
    material: new CANNON.Material("modelMaterial"),
  });
  modelBody.position.set(0, 0, 0);
  world.addBody(modelBody);

  animations = new THREE.AnimationMixer(model);
  let action = animations.clipAction(gltf.animations[0]);

  //character movement
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        modelBody.position.z -= velocity;
        model.rotation.y = 2 * Math.PI;
        break;
      case "s":
        modelBody.position.z += velocity;
        model.rotation.y = Math.PI;
        break;
      case "a":
        modelBody.position.x -= velocity;
        model.rotation.y = Math.PI / 2;
        break;
      case "d":
        modelBody.position.x += velocity;
        model.rotation.y = -Math.PI / 2;
        break;
    }
  });
  action.play();
});
scene.add(character);

//loading scene
const loader = new GLTFLoader();

const glbFile = '/public/interior  20.glb';       //! Load GLB file ***

loader.load( glbFile, function ( gltf ) {
  gltf.scene.children.find((child) => child.name === "glbFile");
  gltf.scene.scale.set(gltf.scene.scale.x * 0.4, gltf.scene.scale.y * 0.4, gltf.scene.scale.z * 0.4);
  gltf.scene.position.y += gltf.scene.scale.y - 0.55;
  scene.add( gltf.scene );
}, undefined, function ( error ) {

  console.error( error );

} )


//animate function--------------------------

const clock = new THREE.Clock();
const render = function () {
  requestAnimationFrame(render);
  const delta = clock.getDelta();

  if (animations) {
  animations.update(delta);
  world.step(1 / 60, delta, 3);
  model.position.x=modelBody.position.x;
  model.position.z=modelBody.position.z;
};

  world.step(delta); // Update cannon-es physics
  cannonDebugger.update();

  renderer.render(scene, camera);
}

render();