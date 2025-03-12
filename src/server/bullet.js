const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parentID, pos, vel, dir) {
    super(shortid(), pos.x, pos.y, vel.x, vel.y, dir);
    this.parentID = parentID;
    this.hp = Constants.BULLET_HP;
    this.radius = Constants.BULLET_RADIUS;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.updatePosition(dt);
    return this.position.x < 0 || this.position.x > Constants.MAP_SIZE || this.position.y < 0 || this.position.y > Constants.MAP_SIZE;
  }
}

module.exports = Bullet;
