class Entity {
  constructor(x, y, z, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.endPos = new THREE.Vector3(x, y, z);
    this.container = new THREE.Object3D();
    this.container.position.set(x, y, z);
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
    this.loader = new THREE.JSONLoader();
    this.modelMaterial = new THREE.MeshBasicMaterial({
      map: playerTexture, // dowolny plik png, jpg
      morphTargets: true, // ta własność odpowiada za możliwość animowania materiału modelu

    });
    console.log(this.modelMaterial)

    this.loader.load('/img/player.js', (geometry) => {

      let meshModel = new THREE.Mesh(geometry, this.modelMaterial)
      meshModel.name = "player";
      meshModel.rotation.y = Math.PI; // ustaw obrót modelu
      meshModel.position.y = 25 * this.size; // ustaw pozycje modelu
      meshModel.scale.set(this.size, this.size, this.size); // ustaw skalę modelu

      //console.log(geometry.animations)
      this.mesh = meshModel;
      this.container.add(meshModel);


      this.mixer = new THREE.AnimationMixer(meshModel);

      //this.changeAnimation('run');
    });




  }

  assignFollower(f) {
    this.followers.push(f);
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
        // console.log(this.container.position)
        this.mixer.clipAction(what).play() //run/stand/attack/jump/death
      }
    }
  }

  moveTo(vector) {
    if (this.container.position.distanceTo(this.endPos) > 10) {
      this.container.translateOnAxis(vector, 10);
      this.stance = 'run';
      this.setAnimation(this.stance);


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
  constructor(x, y, z, size) {
    super(x, y, z, size);

    this.mesh = null;
    this.qb;
    this.loader = new THREE.JSONLoader();
    this.container.name = 'enemy';
    this.stance = 'stand';
    this.parents = [];
    this.modelMaterial = new THREE.MeshBasicMaterial({
      map: enemyTexture, // dowolny plik png, jpg
      morphTargets: true, // ta własność odpowiada za możliwość animowania materiału modelu
    });
    //console.log(this.modelMaterial)

    this.loader.load('/img/enemy.js', (geometry) => {

      let meshModel = new THREE.Mesh(geometry, this.modelMaterial)
      meshModel.name = "enemy";
      meshModel.rotation.y = Math.PI; // ustaw obrót modelu
      meshModel.position.y = 25 * this.size; // ustaw pozycje modelu
      meshModel.scale.set(this.size, this.size, this.size); // ustaw skalę modelu

      //console.log(geometry.animations)
      this.mesh = meshModel;
      //console.log(this.mesh)
      this.container.add(meshModel);
      // this.container.add(this.obj);


      this.mixer = new THREE.AnimationMixer(meshModel);

      //this.changeAnimation('run');
    });
    let boxgeo = new THREE.BoxGeometry(this.size * 20, this.size * 120, this.size * 20);
    let material = new THREE.MeshBasicMaterial({
      // color: 0xffffff
      transparent: true,
      opacity: 0
    });
    this.qb = new THREE.Mesh(boxgeo, material);
    this.qb.name = 'enemy';
    this.qb.userData = this;
    this.qb.position.set(x, y, z);

    scene.add(this.qb);



  }

  assignParent(p) {
    //if (!this.parents[0]) {

    this.parents.push(p);
    // }
  }


  animate(delta) { //animation or moving
    if (this.mixer) {
      //console.log(delta)
      this.mixer.update(delta);

    }
  }
  setAnimation(what) {
    if (this.mixer) {
      if (what == 'stand') {
        this.mixer.clipAction('run').stop();
        this.mixer.clipAction(what).play()
      } else {
        //console.log(this.container.position)
        this.mixer.clipAction(what).play() //run/stand/attack/jump/death
      }
    }
  }

  moveTo() {

    if (this.parents.length > 0) {
      let parentVector = this.parents[this.parents.length - 1].container.position;
      let vector = parentVector.clone().sub(this.container.position).normalize();


      let angle = Math.atan2(
        this.container.position.clone().x - parentVector.clone().x,
        this.container.position.clone().z - parentVector.clone().z
      )
      this.mesh.rotation.y = angle + Math.PI * 1.5;





      this.endPos = this.parents[this.parents.length - 1].container.position;
      if (this.container.position.distanceTo(this.endPos) > 40 * this.size) {
        this.container.translateOnAxis(vector, 10);
        this.qb.position.set(this.container.position);
        this.stance = 'run';
        this.setAnimation(this.stance);
        //console.log('aaa')
      } else {
        this.stance = "stand";
        this.setAnimation(this.stance);
      }
    }
  }
}