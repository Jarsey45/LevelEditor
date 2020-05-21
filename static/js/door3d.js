class Door3D {

  constructor(width, height) {

    this.radius = Settings.scale; // zmienna wielkość hexagona, a tym samym całego labiryntu

    //contener
    let container = new THREE.Object3D() // kontener na obiekty 3D
    container.position.set(0, this.radius / 16, 0);


    //wall1
    let planeGeo1 = new THREE.PlaneGeometry(this.radius / 6, this.radius / 4, 32);
    let wall1 = new THREE.Mesh(planeGeo1, wallMaterial); // prostopadłościan - ściana hex-a
    wall1.position.set(-this.radius / 6, 0, 0);

    let planeGeo2 = new THREE.PlaneGeometry(this.radius / 6, this.radius / 4, 32);
    let wall2 = new THREE.Mesh(planeGeo2, wallMaterial); // prostopadłościan - ściana hex-a
    wall2.position.set(this.radius / 6, 0, 0);


    container.add(wall2);
    container.add(wall1);

    return container

  }


}