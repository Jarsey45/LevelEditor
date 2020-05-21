class Entity {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.container = new THREE.Object3D();
  }
}

class Player extends Entity {
  constructor() {

  }
}

class Enemy extends Entity {
  constructor() {

  }
}