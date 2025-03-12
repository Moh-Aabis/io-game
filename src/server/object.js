const Vector2D = require('./vector');

class Object {
  constructor(id, x, y, vx, vy, dir) {
    this.id = id;
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D(vx, vy);
    this.direction = dir;
  }

  updatePosition(dt) {
    this.position.add(this.velocity.clone().multiply(dt));
    // this.position.addMagnitudeInDirection(dt * this.speed, this.direction);
  }

  distanceTo(object) {
    return this.position.clone().subtract(object.position).magnitude();
  }

  setDirection(dir) {
    this.direction = dir;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.position.x,
      y: this.position.y,
    };
  }
}

module.exports = Object;
