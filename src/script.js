import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { RigidBody, World } from '@dimforge/rapier3d';
import * as CANNON from "cannon-es";
import CannonDebugger from 'cannon-es-debugger'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CharacterControls } from "./controls";
import { world } from "./keys";
import * as dat from 'lil-gui'

//Creating three and cannon world-------------------------------
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene()
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

//Helpers
// const helper= new CannonHelper(this.scene);
const cannonDebugger = new CannonDebugger(scene, world, {
  color: 0xffff,
  
})
const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper( 10000, 1000 );
scene.add( gridHelper );

/**
 * Debug
 */
 const gui = new dat.GUI();
 const debugObject = {};
 
 debugObject.createSphere = () =>
 {
	 createSphere(
		 Math.random() * 2,
		 {
			 x: (Math.random() - 0.5) * 3,
			 y: 3,
			 z: (Math.random() - 0.5) * 3
		 }
	 )
 }
 
 gui.add(debugObject, 'createSphere')
 debugObject.reset = () =>
{
    for(const object of objectsToUpdate)
    {
        // Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // Remove mesh
        scene.remove(object.mesh)
    }
}
gui.add(debugObject, 'reset')

//defining materials------------------------------------------

const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.5,
  }
);
world.defaultContactMaterial = defaultContactMaterial;

//texturing

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

//Sizing-------------------------------------------------------

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

//camera ----------------------------------------------------

const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
  );
  camera.position.set(5, 5, 5);
  scene.add(camera);
  
 //Orbit Controls-----------------------------------------------

const orbitControl = new OrbitControls(camera, canvas);
orbitControl.enableDamping = true;
orbitControl.minDistance = 7;
orbitControl.maxDistance = 50;
orbitControl.enablePan = false;
orbitControl.maxPolarAngle = Math.PI / 2 - 0.05;
orbitControl.update(orbitControl)

//lights---------------------------------------------------

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.camera.left = -7;
// directionalLight.shadow.camera.top = 7;
// directionalLight.shadow.camera.right = 7;
// directionalLight.shadow.camera.bottom = -7;
// directionalLight.position.set(5, 5, 5);
// scene.add(directionalLight);



/*
//Features Code
 */
//walls
//WALLS

//north Wall
const wallN = new THREE.Mesh(
	new THREE.BoxGeometry(50, 10, 0.1),
	new THREE.MeshStandardMaterial({
	  color: 0x00ff,
	  metalness: 0.3,
	  roughness: 0.4,
	//   envMap: environmentMapTexture,
	  envMapIntensity: 0.5,
	})
  );
  wallN.position.set(-25, 5, 0);
  wallN.receiveShadow = true;
  wallN.rotation.y = Math.PI * 0.5;
  scene.add(wallN);
  //physics
  const wallNShape = new CANNON.Box(new CANNON.Vec3(25, 5, 0.1));
  const wallNBody = new CANNON.Body();
  wallNBody.mass = 1;
  wallNBody.addShape(wallNShape);
  wallNBody.position.set(-25, 5, 0);
  wallNBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI*0.5);
  world.addBody(wallNBody);
  
  //south wall
  const wallS = new THREE.Mesh(
	new THREE.BoxGeometry(50, 10, 0.1),
	new THREE.MeshStandardMaterial({
	  color: 0x00ff00,
	  metalness: 0.3,
	  roughness: 0.4,
	//   envMap: environmentMapTexture,
	  envMapIntensity: 0.5,
	})
  );
  wallS.position.set(25, 5, 0);
  wallS.receiveShadow = true;
  wallS.rotation.y = Math.PI * 0.5;
  scene.add(wallS);
  
  //physics
  const wallSShape = new CANNON.Box(new CANNON.Vec3(25, 5, 0.1));
  const wallSBody = new CANNON.Body();
  wallSBody.mass = 1;
  wallSBody.position.set(25,5,0)
  wallSBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI * 0.5)
  wallSBody.addShape(wallSShape);
  world.addBody(wallSBody);
  
  //east wall
  const wallE = new THREE.Mesh(
	new THREE.BoxGeometry(10, 50, 0.1),
	new THREE.MeshStandardMaterial({
	  color: 0xf0ff0f,
	  metalness: 0.3,
	  roughness: 0.4,
	//   envMap: environmentMapTexture,
	  envMapIntensity: 0.5,
	})
  );
  wallE.position.set(0, 5, -25);
  wallE.receiveShadow = true;
  wallE.rotation.z = Math.PI * 0.5;
  scene.add(wallE);
  
  //physics
  const wallEShape = new CANNON.Box(new CANNON.Vec3(5, 25, 0.1));
  const wallEBody = new CANNON.Body();
  wallEBody.mass = 0.5;
  wallEBody.position.set(0,5,-25)
  wallEBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI * 0.5)
  wallEBody.addShape(wallEShape);
  world.addBody(wallEBody);

//Floor--------------------------------------------------------

const floor = new THREE.Mesh(
	new THREE.BoxGeometry(50, 50, 0.01),
	new THREE.MeshStandardMaterial({
	  color: "#000000",
	  metalness: 0.3,
	  roughness: 0.4,
	//   envMap: environmentMapTexture,
	  envMapIntensity: 0.5,
	})
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI * 0.5;
  scene.add(floor);
  //physics
  const floorShape = new CANNON.Box(new CANNON.Vec3(26, 26, 0.1));
  const floorBody = new CANNON.Body();
  floorBody.mass = 0;
  floorBody.addShape(floorShape);
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
  world.addBody(floorBody);


//character controls key events------------------------------

const keysPressed = {};
document.addEventListener(
  "keydown",
  (event) => {
    if (event.shiftKey && characterControls) {
      characterControls.switchRunToggle();
    } else {
      (keysPressed )[event.key.toLowerCase()] = true;
    }
  },
  false
);
document.addEventListener(
  "keyup",
  (event) => {
    (keysPressed)[event.key.toLowerCase()] = false;
  },
  false
);

//loading character

let Avatar = "/public/Soldier.glb"; //?Dynamic character selection
let characterControls;
function createCharacter(Char)
{
	new GLTFLoader().load(Char, function (gltf) {
		const model = gltf.scene;
		model.traverse(function (object) {
		  if (object.isMesh) object.castShadow = true;
		});
		gltf.scene.scale.set(3, 3, 3),
	    scene.add(model);
	  
		const gltfAnimations = gltf.animations;
		const mixer = new THREE.AnimationMixer(model);
		const animationsMap = new Map();
		gltfAnimations
		  .filter((a) => a.name != "TPose")
		  .forEach((a) => {
			animationsMap.set(a.name, mixer.clipAction(a));
		  });

		  //model physics
		  


		  characterControls = new CharacterControls(
			  model,
			  mixer,
			  // body,
			//   body1,
			  animationsMap,
			  orbitControl,
			  camera,
			  "Idle"
			);  
	  });
	  
}
createCharacter(Avatar)

//test models

const objectsToUpdate = [];
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    // envMap: environmentMapTexture,
    envMapIntensity: 0.5
})
const createSphere = (radius, position) =>
{
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape1 = new CANNON.Sphere(radius)

    const body1 = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape1,
        material: defaultMaterial
    })
    body1.position.copy(position)
    // body.addEventListener('collide', playHitSound)
    world.addBody(body1)

    // Save in objects
    objectsToUpdate.push({ mesh, body1 })
}

//Renderer----------------------------------------------------


 const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


//animate function-----------------------------------------------



const clock = new THREE.Clock();
let oldElapsedTime = 0;

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  //animations of character
  if (characterControls) {
    characterControls.update(deltaTime, keysPressed);
  }
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body1.position);
    object.mesh.quaternion.copy(object.body1.quaternion);
  }
//   console.log(body.position)
  // Update controls
  orbitControl.update();

  // Update physics
  world.step(1 / 60, deltaTime, 3);

  // Render
  cannonDebugger.update();
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(animate);
};
animate();