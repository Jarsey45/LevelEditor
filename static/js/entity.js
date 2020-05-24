class Entity {
  constructor(x, y, z, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.endPos = new THREE.Vector3(x, y, z);
    this.container = new THREE.Object3D();
    this.mixer = null;
  }

  getContainer() {
    return this.container;
  }

}

class Player extends Entity {
  constructor(x, y, z, size) {
    super(x, y, z, size);

    this.mesh;
    this.stance = 'stand';
    this.followers = [];
    this.modelMaterial = new THREE.MeshBasicMaterial({
      map: playerTexture, // dowolny plik png, jpg
      morphTargets: true // ta własność odpowiada za możliwość animowania materiału modelu
    });
    console.log(this.modelMaterial)

    loader.load('/img/player.js', (geometry) => {

      let meshModel = new THREE.Mesh(geometry, this.modelMaterial)
      meshModel.name = "player";
      meshModel.rotation.y = Math.PI; // ustaw obrót modelu
      meshModel.position.y = 25 * this.size; // ustaw pozycje modelu
      meshModel.scale.set(this.size, this.size, this.size); // ustaw skalę modelu

      console.log(geometry.animations)
      this.mesh = meshModel;
      this.container.add(meshModel);


      this.mixer = new THREE.AnimationMixer(meshModel);

      //this.changeAnimation('run');
    });


  }


  animate(delta) { //animation or moving
    if (this.mixer) {
      this.mixer.update(delta);

    }
  }
  setAnimation(what) {
    if (this.mixer) {
      if (what == 'stand') {
        this.mixer.clipAction('run').stop();
        this.mixer.clipAction(what).play()
      } else {

        this.mixer.clipAction(what).play() //run/stand/attack/jump/death
      }
    }
  }

  moveTo(vector) {
    if (this.container.position.distanceTo(this.endPos) > 10) {
      this.container.translateOnAxis(vector, 10);
      this.stance = 'run';
      this.setAnimation(this.stance);
      //console.log('aaa')
    } else {
      this.stance = "stand";
      this.setAnimation(this.stance);
    }




    camera.position.x = this.container.position.x + 600
    camera.position.z = this.container.position.z + 800
    camera.position.y = this.container.position.y + 600
    camera.lookAt(this.container.position)
    //console.log(this.container.position)
  }

}

class Enemy extends Entity {
  constructor() {

  }
}