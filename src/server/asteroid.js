const ObjectClass = require('./object');
const shortid = require('shortid'); //generates ids for asteroids and bullets
const Constants = require('../shared/constants');

class Asteroid extends ObjectClass {
    constructor(x, y, r) {
        super(shortid(), x, y, Math.PI, 100);
        this.radius = r;
        this.hp = Constants.ASTEROID_HP;
    }

    checkOutOfBounds() {
        return this.distanceTo({x: 0, y: 0}) > 1000;
    }

    serializeForUpdate() {
        return {
          id: this.id,
          x: this.x,
          y: this.y,
          r: this.radius,
        };
      }
}

module.exports = Asteroid;