class Hex3D {

  constructor(door1, door2, x, z) {

    this.radius = Settings.scale; // zmienna wielkość hexagona, a tym samym całego labiryntu

    //contener
    let container = new THREE.Object3D() // kontener na obiekty 3D
    container.position.set(x, this.radius / 16, z);
    //console.log(container.position)

    //door
    //let door = new Door3D(this.radius / 2, this.radius / 8);
    //container.add(door)


    //wall
    let planeGeo = new THREE.PlaneGeometry(this.radius / 2, this.radius / 8, 32);
    let wall = new THREE.Mesh(planeGeo, wallMaterial); // prostopadłościan - ściana hex-a
    wall.position.set(x, this.radius / 16, z);


    //floor
    let floorGeo = new THREE.CylinderGeometry(this.radius / 2, this.radius / 2, 0.1, 6)
    let floor = new THREE.Mesh(floorGeo, floorMaterial);
    container.add(floor)



    for (let i = 0; i < 6; i++) {
      let side;
      if (i == door1 || i == door2) {
        side = new Door3D(this.radius / 2, this.radius / 8);
      } else {
        side = wall.clone() // klon ściany
      }

      side.position.x = (this.radius / 2 * Math.sqrt(3)) / 2 * Math.cos(Math.PI / 3 * i);
      side.position.z = (this.radius / 2 * Math.sqrt(3)) / 2 * Math.sin(Math.PI / 3 * i);

      side.lookAt(new THREE.Vector3(0, this.radius / 16, 0)) // nakierowanie ściany na środek kontenera 3D  
      //console.log(container.position)
      container.add(side) // dodanie ściany do kontenera

    }

    return container

  }


}