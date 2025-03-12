const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');
const Vector2D = require('./vector');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, 0, 0, Math.random() * 2 * Math.PI);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.radius = Constants.PLAYER_RADIUS;
    this.fireCooldown = 0;
    this.score = 0;
    this.input = {
      lcl: false,
      rcl: false,
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
    if (this.input.rcl == true) {
      this.updateVelocity(dt);
    }
    this.updatePosition(dt);
    // Make sure the player stays in bounds
    this.position.clamp(0, Constants.MAP_SIZE);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown < 0) {
      this.fireCooldown = 0;
    }
    if (this.fireCooldown == 0 && this.input.lcl) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      const bulletVelocity = new Vector2D(Math.cos(this.direction), Math.sin(this.direction)).setMagnitude(Constants.BULLET_SPEED).add(this.velocity);
      return new Bullet(
        this.id, 
        this.position, 
        bulletVelocity, 
        this.direction
      );
    }

    return null;
  }

  updateVelocity() {
    this.velocity = new Vector2D(
      Constants.PLAYER_SPEED * Math.cos(this.direction), 
      Constants.PLAYER_SPEED * Math.sin(this.direction)
    );
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
