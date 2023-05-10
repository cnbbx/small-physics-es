# Physics Engine Documentation

This documentation outlines the implementation details of a physics engine built using Three.js. The engine allows for the simulation of physical interactions between objects in 3D space.

## Classes

### PhysicsObject

Represents a basic physical object with properties such as position, velocity, mass, bounciness, and collision handling. 

#### Properties
- `gravity`: a scalar value representing gravitational force acting on the object
- `velocity`: a THREE.Vector3 object representing the object's current velocity
- `position`: a THREE.Vector3 object representing the object's current position
- `radius`: the radius of the object (default: 1)
- `width`: the width of the object (default: 1)
- `height`: the height of the object (default: 1)
- `depth`: the depth of the object (default: 1)
- `mass`: the mass of the object (default: 0)
- `bounciness`: a scalar value representing the amount of bounce the object has (default: 0.1)
- `rotation`: a THREE.Euler object representing the object's current rotation
- `direction`: a THREE.Vector3 object representing the direction the object is facing (default: new THREE.Vector3(0, 0, -1))
- `mesh`: a THREE.Mesh object representing the object's visual representation
- `collisionCount`: the number of consecutive collisions the object has had with another object
- `collisionObject`: the object that the current object collided with most recently

#### Methods
- `update()`: updates the position and velocity of the object based on the current gravitational force acting on it.
- `handleCollision(otherObject)`: handles collisions between this object and another object.
 
### PhysicsBox

Represents a physical box-shaped object derived from the `PhysicsObject` class.

#### Properties
- Inherits properties from `PhysicsObject`
- `color`: a string representing the color of the box (default: 0xffffff)

#### Methods
- Inherits methods from `PhysicsObject`

### PhysicsSphere

Represents a physical sphere-shaped object derived from the `PhysicsObject` class.

#### Properties
- Inherits properties from `PhysicsObject`
- `color`: a string representing the color of the sphere (default: 0xffffff)

#### Methods
- Inherits methods from `PhysicsObject`

### PhysicsPlane

Represents a physical plane-shaped object derived from the `PhysicsObject` class.

#### Properties
- Inherits properties from `PhysicsObject`
- `color`: a string representing the color of the plane (default: 0xffffff)

#### Methods
- Inherits methods from `PhysicsObject`

### PhysicsWorld

Represents the world in which physical objects exist and interact.

#### Properties
- `scene`: a THREE.Scene object representing the scene in which the physical objects are rendered
- `objects`: an array of physical objects currently present in the simulation

#### Methods
- `add(object)`: adds a physical object to the simulation
- `remove(object)`: removes a physical object from the simulation
- `update()`: updates the positions and velocities of all physical objects in the simulation based on collisions with other objects
- `checkCollision(object1, object2)`: checks if there is a collision between two physical objects

## Implementation Details

The physics engine uses an Euler integration scheme to calculate the position and velocity of each object. The calculation is based on the net force acting on each object which is summed up from different forces such as gravitational force, collision forces, and user forces.

Collision detection is performed using Axis-Aligned Bounding Box (AABB) checks. If a collision is detected between two objects, the `handleCollision` method of each object is called with the other object as an argument. The method then calculates the new positions and velocities of the objects after the collision.

To prevent objects from bouncing infinitely after a collision, a `collisionCount` variable is used to count consecutive collisions between two objects. If the count exceeds a certain value, no more collisions are handled between those objects.

The `PhysicsWorld` class is responsible for adding and removing physical objects from the simulation, as well as updating the positions and velocities of all objects in the simulation. The `update()` method of the `PhysicsWorld` class is called once per frame to update the simulation.

## Usage

To use the physics engine, first create a `THREE.Scene` object and pass it to the `PhysicsWorld` constructor. Then, create instances of `PhysicsObject`, `PhysicsBox`, `PhysicsSphere`, or `PhysicsPlane` and add them to the `PhysicsWorld` object using the `add()` method. Finally, call the `update()` method of the `PhysicsWorld` object once per frame to simulate the physics.

```javascript
import * as THREE from 'three';
import { PhysicsWorld, PhysicsBox } from './physics-engine.js';

const scene = new THREE.Scene();
const world = new PhysicsWorld(scene);

const box = new PhysicsBox({
  position: new THREE.Vector3(0, 5, 0),
  width: 2,
  height: 2,
  depth: 2,
  mass: 5,
  color: 0xff0000
});

world.add(box);

function animate() {
  requestAnimationFrame(animate);
  world.update();
}

animate();
``` 

## Conclusion

This physics engine allows for the simulation of basic physical interactions between objects in a 3D space. It uses an Euler integration scheme and AABB checks for collision detection, and is capable of handling collisions between different types of physical objects.