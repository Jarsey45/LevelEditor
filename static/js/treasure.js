class Treasure {
  constructor(size) {
    this.size = size;
    this.container = new THREE.Object3D();

    let chestGeo = new THREE.BoxGeometry(this.size, this.size, this.size);
    let chest = new THREE.Mesh(chestGeo, treasureMaterial);
    this.container.add(chest);

    return this.container;

  }
}