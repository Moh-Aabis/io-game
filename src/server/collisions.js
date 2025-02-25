const Constants = require('../shared/constants');

class Collision {
  constructor(o1, o2) {
    this.o1 = o1;
    this.o2 = o2;
  }

  damageObjects () {
    this.o1.hp -= Constants.DAMAGE;
    this.o2.hp -= Constants.DAMAGE;
  }
}

class CollisionHandler {
  constructor() {
    this.collisions = [];
  }

  applyCollisions(players, bullets, asteroids) {
    this.collisions = [];
    this.updatePlayerBulletCollisions(players, bullets);
    this.updateAsteroidCollisions(asteroids, players, bullets);
    this.resolveCollisions();
  }

  updatePlayerBulletCollisions (players, bullets) {
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const enemyBullets = bullets.filter(b => b.parentID != player.id);
      for (let j = 0; j < enemyBullets.length; j++) {
        this.checkCollisionCircles(player, enemyBullets[j]);
      }
    }
  }

  updateAsteroidCollisions (asteroids, players, bullets) {
    const objects = players.concat(bullets);
    for (let i = 0; i < asteroids.length; i++) {
      const asteroid = asteroids[i];
      for (let j = 0; j < objects.length; j++) {
        this.checkCollisionCircles(asteroid, objects[j]);
      }
    }
  }

  checkCollisionCircles (o1, o2) {
    if (o1.distanceTo(o2) < o1.radius + o2.radius) {
      this.collisions.push(new Collision(o1, o2));
    }
  }

  resolveCollisions () {
    this.collisions.forEach(
      col => {
        col.damageObjects();
      }
    );
  }

}

module.exports = CollisionHandler;
