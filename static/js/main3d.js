//VARAIBLES
let level = [];
let enemies = [];
const clock = new THREE.Clock();


//SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);


//TEXTURES
const wallTexture = new THREE.TextureLoader().load("/img/walls.jpg");
const floorTexture = new THREE.TextureLoader().load("/img/floor.jpg");
const treasureTexture = new THREE.TextureLoader().load("/img/gold.png");
const playerTexture = new THREE.TextureLoader().load("/img/LadyDeath1.png");
const enemyTexture = new THREE.TextureLoader().load("/img/Icha.png");
//const fireTexture;


//LIGHT
const light = new THREE.AmbientLight(0xffffff, 0.1)
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

//RAYCASTER SETTINGS
const raycaster = new THREE.Raycaster();
const mousePos = new THREE.Vector2();


//RENDERER
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize($(window).width(), $(window).height() - 25);

window.addEventListener('resize', function () {
  renderer.setSize($(window).width(), $(window).height() - 25);
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//ORBIT CONTROL
// const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.update();


//MATERIAL
const material = new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide,
  //wireframe: true,

});
const treasureMaterial = new THREE.MeshPhongMaterial({
  map: treasureTexture
});
const particleMaterial = new THREE.MeshBasicMaterial({
  color: 0xff6600,
  transparent: true,
  opacity: 0.5,
  depthWrite: false,
  blending: THREE.AdditiveBlending // kluczowy element zapewniający mieszanie ze sobą kolorów cząsteczek
});
const wallMaterial = new THREE.MeshPhongMaterial({ // odbicia swaitel etc
  side: THREE.DoubleSide, // chce by sciana nie zaslaniala nam widoku
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

//PSOTAC NEEDED
//player
let mouseVector = new THREE.Vector3(0, 0, 0);
let directionVector = new THREE.Vector3(0, 0, 0);
let moveToVector = new THREE.Vector3(0, 0, 0);
let player;
//scene.add(player.getContainer());


// for (let i = 0; i < 10; i++) {
//   let enemy = new Enemy(getRandomInt(-500, 500) * i, 0, getRandomInt(-500, 500) * i, 5);
//   enemies.push(enemy);
//   scene.add(enemy.getContainer());
// }





load()






$("#root").append(renderer.domElement);

function draw() {
  requestAnimationFrame(draw);



  //camera.lookAt(scene.position);
  // controls.update();



  //PSOTAC NEEDED
  if (player) {

    player.animate(clock.getDelta());
    player.moveTo(moveToVector);
  }

  //enemy NEEDED
  for (let enemy of enemies) {
    enemy.animate(clock.getDelta());
    enemy.moveTo();

  }


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
        let tmp;
        if (index == 0) {
          tmp = new Hex3D(el.arrowOut, el.arrowIn, x, z, "player");
          player = new Player(x, 60, z, 3);
          scene.add(player.container);

        } else {
          tmp = new Hex3D(el.arrowOut, el.arrowIn, x, z, el.type)
          if (el.type == 'enemy') {
            let enemy = new Enemy(x, 60, z, 3);
            //console.log(enemy.container.position);
            enemy.qb.position.set(x, 60, z);
            enemies.push(enemy);
            scene.add(enemy.container);
          }
        }
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


//PSOTAC NEEDED
$("#root").on('click', function () {
  mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;


  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mousePos, camera);

  // calculate objects intersecting the picking ray
  let intersects = raycaster.intersectObjects(scene.children, true);
  // console.log(intersects);
  if (intersects[0] && intersects[0].object.name == 'enemy') {
    let object = intersects[0].object.userData;
    object.assignParent(player);
    for (let f of player.followers) {
      //console.log(f);
      object.assignParent(f);
    }
    player.assignFollower(object);
    // console.log(object.parents);
    // console.log(player.followers)


  } else if (intersects[0] && intersects[0].object.name == 'floor') {

    mouseVector = intersects[0].point;
    playerVector = player.container.position;
    moveToVector = mouseVector.clone().sub(playerVector).normalize();
    player.endPos = mouseVector;

    let angle = Math.atan2(
      player.container.position.clone().x - mouseVector.clone().x,
      player.container.position.clone().z - mouseVector.clone().z
    )
    player.mesh.rotation.y = angle + Math.PI * 1.5;

  }

});