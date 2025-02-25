const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.radius = Constants.PLAYER_RADIUS;
    this.fireCooldown = 0;
    this.score = 0;
    this.input = {
      lcl: false,
      dir: 0,
      w: false,
      a: false,
      s: false,
      d: false,
    };
    this.inputVelocity = {x: 0, y: 0};
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    this.setInputVelocity();
    this.updatePosition(dt);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown < 0) {
      this.fireCooldown = 0;
    }
    if (this.fireCooldown == 0 && this.input.lcl) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      return new Bullet(this.id, this.x, this.y, this.direction);
    }

    return null;
  }

  setInputVelocity() {
    this.inputVelocity = {x: 0, y: 0};
    if (this.input.w) {
      this.inputVelocity.y -= 1;
    }
    if (this.input.a) {
      this.inputVelocity.x -= 1;
    }
    if (this.input.s) {
      this.inputVelocity.y += 1;
    }
    if (this.input.d) {
      this.inputVelocity.x += 1;
    }
    // vector magnitude using pythagorean  theorem
    const magnitude = Math.sqrt(this.inputVelocity.x ** 2 + this.inputVelocity.y ** 2);
    // normalize input velocity vector
    if (magnitude != 0) {
      this.inputVelocity.x /= magnitude;
      this.inputVelocity.y /= magnitude;
    }
  }

  updatePosition(dt) {
    // velocity-position kinematics
    this.x += this.speed * this.inputVelocity.x * dt;
    this.y += this.speed * this.inputVelocity.y * dt;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
    };
  }
}

module.exports = Player;
