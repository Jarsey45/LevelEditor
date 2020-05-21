class Fire {
  constructor(size, material, lightSize) {
    this.size = size;
    this.lightSize = lightSize;
    this.particleMaterial = material;
    this.particles = [];
    this.light;
    this.container = new THREE.Object3D();

    this.setup();

  }

  setup() {
    //swiatlo
    this.light = new THREE.PointLight(0xff6600, 1.5, this.lightSize, 2); //this.size / 20);
    this.light.position.set(this.container.position.x, 50, this.container.position.z);
    this.light.castShadow = true;
    this.container.add(this.light);

    //drzewka
    let belkaMaterial = new THREE.MeshPhongMaterial({
      color: 0x2b140e,
      shininess: 5
    });
    let belkaGeometry = new THREE.CylinderGeometry(25, 25, this.size / 4, 6);
    for (let i = 0; i < 6; i++) {
      let belka = new THREE.Mesh(belkaGeometry, belkaMaterial);
      belka.castShadow = true;
      belka.position.x = (this.size / 2 * Math.sqrt(3)) / 4 * Math.cos(Math.PI / 3 * i);
      belka.position.z = (this.size / 2 * Math.sqrt(3)) / 4 * Math.sin(Math.PI / 3 * i);
      belka.rotation.x = Math.PI / 2;
      belka.rotation.z = Math.PI / 3 * i;
      //console.log(belka.rotation)
      this.container.add(belka);
    }


    for (let i = 0; i < this.size / 2; i++) {
      this.particles.push(new Particle(this.particleMaterial, this.size));
    }

    this.update();
    this.show();

  }

  update() {
    requestAnimationFrame(() => this.update());
    for (let particle of this.particles) {
      particle.update();
    }
  }

  show() {
    requestAnimationFrame(() => this.show());
    for (let particle of this.particles) {
      this.container.add(particle.obj);
    }
  }
}

class Particle {
  constructor(material, size) {
    this.size = size / 10;
    this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
    this.material = material;
    this.obj = new THREE.Mesh(this.geometry, this.material.clone());
    this.obj.position.set(randomInt(-this.size * 2, this.size * 2), randomInt(0, this.size * 6), randomInt(-this.size * 2, this.size * 2))
    //console.log(this.obj.material.opacity)

  }

  update() {
    if (this.obj.position.y < 6 * this.size) {
      this.obj.position.y += 0.2 * this.size;
      this.obj.material.opacity = mapInt(this.obj.position.y, 0, 6 * this.size, 0.5, 0);
    } else {
      this.obj.position.set(randomInt(-this.size * 2, this.size * 2), 0, randomInt(-this.size * 2, this.size * 2))
    }
  }
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function mapInt(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};