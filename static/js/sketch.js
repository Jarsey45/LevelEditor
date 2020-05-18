var fov = 70;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  fov, // kąt patrzenia kamery (FOV - field of view)
  window.innerWidth / window.innerHeight, // proporcje widoku, powinny odpowiadać proporcjom naszego ekranu przeglądarki
  0.1, // minimalna renderowana odległość
  10000 // maksymalna renderowana odległość od kamery
);
const renderer = new THREE.WebGLRenderer();
const axes = new THREE.AxesHelper(1000);
var geometry = new THREE.BoxGeometry(100, 100, 100);
var material = new THREE.MeshBasicMaterial({
  color: 0x8888ff,
  side: THREE.DoubleSide,
  wireframe: false,
  transparent: true,
  opacity: 0.5
});
var cube = new THREE.Mesh(geometry, material);


renderer.setClearColor(0xffffff);
renderer.setSize(500, 500);

camera.position.set(100, 100, 100);
camera.lookAt(scene.position);

scene.add(axes);
scene.add(cube);


$("#root").append(renderer.domElement);



function draw() {
  requestAnimationFrame(draw);



  renderer.render(scene, camera);
}
draw();