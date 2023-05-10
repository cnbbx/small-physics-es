import * as THREE from 'three';

export class PhysicsObject {
  constructor(options) {
    this.gravity = options.gravity || 0.005;
    this.velocity = new THREE.Vector3();
    this.position = options.position || new THREE.Vector3();
    this.radius = options.radius || 1;
    this.width = options.width || 1;
    this.height = options.height || 1;
    this.depth = options.depth || 1;
    this.mass = options.mass || 0;
    this.bounciness = options.bounciness || 0.1;
    this.rotation = options.rotation || new THREE.Euler();
    this.direction = options.direction || new THREE.Vector3(0, 0, -1);
    this.mesh = null;
    this.collisionCount = 0;
    this.collisionObject = null;
  }

  update() {
    if (this.mass < 1) return;
    if (this.collisionCount > 2) return;
    const gravityForce = new THREE.Vector3(0, -this.gravity * this.mass, 0);
    const acceleration = gravityForce.divideScalar(this.mass);
    this.velocity.add(acceleration);
    this.position.add(this.velocity);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.copy(this.rotation);
  }

  handleCollision(otherObject) {
    if (this.mass < 1) return;
    if (this.collisionObject == otherObject) { this.collisionCount++; } else { this.collisionCount = 0; }
    if (this.collisionCount > 2) return;
    const randomX = Math.random() * 0.1 - 0.05;
    const randomZ = Math.random() * 0.1 - 0.05;
    this.position.x += randomX;
    this.position.z += randomZ;
    this.collisionObject = otherObject;
    const direction = new THREE.Vector3(0, 1, 0);
    const velocityComponent = this.velocity.clone().projectOnVector(direction);
    this.velocity.sub(velocityComponent.multiplyScalar(1 + this.bounciness));
    const h1 = this.position.y;
    const h2 = Math.pow(velocityComponent.length(), 2) * this.bounciness / (2 * this.gravity) + h1;
    this.position.setY(Math.max(Math.max(h2, this.position.y + 0.1), this.radius));
    this.mesh.position.copy(this.position);
    this.mesh.rotation.copy(this.rotation);
  }

}

export class PhysicsBox extends PhysicsObject {
  constructor(options) {
    super(options);
    this.radius = Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2) + Math.pow(this.depth, 2)) * 0.29;
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    const material = new THREE.MeshBasicMaterial({
      color: options.color
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.copy(this.rotation);
  }
}

export class PhysicsSphere extends PhysicsObject {
  constructor(options) {
    super(options);
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: options.color
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.copy(this.rotation);
  }
}

export class PhysicsPlane extends PhysicsObject {
  constructor(options) {
    super(options);
    const geometry = new THREE.PlaneGeometry(this.width, this.height);
    const material = new THREE.MeshBasicMaterial({ color: options.color, side: THREE.DoubleSide });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.copy(this.rotation);
  }
}

export class PhysicsWorld {
  constructor(scene) {
    this.scene = scene;
    this.objects = [];
  }

  add(object) {
    this.objects.push(object);
    this.scene.add(object.mesh);
    return this;
  }

  remove(object) {
    const index = this.objects.indexOf(object);
    if (index !== -1) {
      this.objects.splice(index, 1);
      this.scene.remove(object.mesh);
    }
  }

  update() {
    for (const object of this.objects) {
      object.update();
      for (const otherObject of this.objects) {
        if (object === otherObject) {
          continue;
        }
        if (this.checkCollision(object, otherObject)) {
          object.handleCollision(otherObject);
        }
      }
    }
  }

  checkCollision(object1, object2) {
    const box1 = new THREE.Box3().setFromObject(object1.mesh);
    const box2 = new THREE.Box3().setFromObject(object2.mesh);
    return box1.intersectsBox(box2);
  }

} 