/**
  THREE.js Template v99
**/
console.clear();
const [ww, wh] = [window.innerWidth, window.innerHeight];

// WebGL Rendering Engine
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(ww, wh);
renderer.setClearColor(0x0f0f0f);
document.body.appendChild(renderer.domElement);

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const lookAt = new THREE.Vector3();

// New Scene
const scene = new THREE.Scene();

// Perspective Camera
const camera = new THREE.PerspectiveCamera(45, ww/wh, 0.1, 1000);

// Position x,y,z axis of camera
camera.position.z = 10;

const controls = new THREE.OrbitControls(camera);

const spotlight = new THREE.SpotLight(0xffffff, 1.5);
const dlight = new THREE.DirectionalLight(0xffffff, 1);
spotlight.power = 70*Math.PI;
spotlight.position.set(-1, 0, 10);
const spotLightHelper = new THREE.SpotLightHelper( spotlight );

// Add Lights
scene.add(spotlight);
scene.add(dlight);
// scene.add(spotLightHelper);

// Update mouse on hover
const onMouseMove = event => {
  mouse.x = (event.clientX/ww) * 2 - 1;
  mouse.y = (event.clientY/wh) * 2 + 1;
};

// Intersecting plane
const intersectGeometry = new THREE.BoxGeometry(4, 3, .1);
const intersectMaterial = new THREE.MeshNormalMaterial();
intersectMaterial.transparent = true;
intersectMaterial.opacity = 0.2;
const intersectPlane = new THREE.Mesh(intersectGeometry, intersectMaterial);
intersectPlane.name = 'plane1';
intersectPlane.position.set(-.2, -.2, 4);
scene.add(intersectPlane);


// Load GLTF model
const loader = new THREE.GLTFLoader();
loader.load('https://cdn.jsdelivr.net/gh/josephrexme/csa/other/bear_head/scene.gltf', gltf => {
  const object = gltf.scene;
  object.rotateY(15.8);
  scene.add(object);

  // render the scene
  const animate = () => {
    // renderer.setAnimationLoop(animate);
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach(intersect => {
      const { point } = intersect;
      if(intersect.object.name === 'plane1') {
        lookAt.x += (lookAt.x - point.x) / 10;
        lookAt.y += (lookAt.y - point.y) / 10;
        lookAt.z += (lookAt.z - point.z) / 10;
      }
    });
    object.lookAt(lookAt);
    renderer.render(scene, camera);
  };

  animate();
});

window.addEventListener('mousemove', onMouseMove);