//VARAIBLES
let level = [];


//SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);


//TEXTURES
const wallTexture = new THREE.TextureLoader().load("/img/walls.jpg");
const floorTexture = new THREE.TextureLoader().load("/img/floor.jpg");
//const fireTexture;


//LIGHT
const light = new THREE.AmbientLight(0xffffff, 0.25)
light.position.set(0, 300, 300)
scene.add(light);


//CAMERA
const camera = new THREE.PerspectiveCamera(
  75, // kąt patrzenia kamery (FOV - field of view)
  window.innerWidth / window.innerHeight, // proporcje widoku, powinny odpowiadać proporcjom naszego ekranu przeglądarki
  0.1, // minimalna renderowana odległość
  10000 // maksymalna renderowana odległość od kamery
);
camera.position.set(300, 300, 300);
camera.lookAt(scene.position);


//RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize($(window).width(), $(window).height() - 25);

window.addEventListener('resize', function () {
  renderer.setSize($(window).width(), $(window).height() - 25);
})


//ORBIT CONTROL
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();


//MATERIAL
const material = new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide,
  //wireframe: true,

});
const wallMaterial = new THREE.MeshPhongMaterial({ // odbicia swaitel etc
  //side: THREE.DoubleSide, // chce by sciana nie zaslaniala nam widoku
  map: wallTexture

});
const floorMaterial = new THREE.MeshPhongMaterial({ // odbicia swiatel etc
  side: THREE.DoubleSide,
  map: floorTexture

});


//GEOMETRY
const geometry = new THREE.BoxGeometry(Settings.scale, Settings.scale, Settings.scale);

//AXES
const axes = new THREE.AxesHelper(1000);
scene.add(axes);






load()



$("#root").append(renderer.domElement);

function draw() {
  requestAnimationFrame(draw);






  camera.lookAt(scene.position);
  controls.update();


  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}
draw();


function load() {
  fetch('/load', {
      method: 'POST'
    })
    .then(response => response.json())
    .then(json => {
      let tmp = json.level.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name);
      });

      json.level = tmp;
      return json;
    })
    .then(json => {
      //console.table(json.level)
      let offset = 0;
      for (let [index, el] of json.level.entries()) {
        el.odd == 0 ? offset = (Settings.scale / 2 * Math.sqrt(3)) / 2 : offset = 0;
        // console.log('AAAAAAA', el, offset)

        let x = el.x * (Settings.scale / 2 + Settings.scale / 4);
        let z = offset + (el.z * (Settings.scale / 2 * Math.sqrt(3)));
        //console.log(x, z, offset)
        let tmp = new Hex3D(el.arrowOut, el.arrowIn, x, z)
        level.push(tmp);
      }
    })
    .then(() => {
      for (let huj of level) {
        huj.rotation.y = Math.PI / 2;

        scene.add(huj)
      }
    })
}