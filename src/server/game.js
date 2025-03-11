const Constants = require('../shared/constants');
const Player = require('./player');
const Asteroid = require('./asteroid');
const CollisionHandler = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.asteroids = [];  //store all asteroids in this list
    this.collisionHandler = new CollisionHandler();
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
    setInterval(this.addAsteroid.bind(this), 2000);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  //a method which creates new asteroids and adds them to the list
  addAsteroid() {
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);  //x values from 0.25 to 0.75 of width of map
    const y = 0;  //all asteroids start at top
    const r = (Math.random() + 1) * 10; //random from 10 to 20
    this.asteroids.push(new Asteroid(x, y, r));
  }

  handleDirection(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  handleInput(socket, input) {
    if (this.players[socket.id]) {
      this.players[socket.id].input = input;
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    //add asteroids
    // if (this.asteroids.length < 10) {
    //   this.addAsteroid();
    // }

    const asteroidsToRemove = []; //store asteroids for removing here

    //update asteroids positions and check if they are too far
    this.asteroids.forEach(asteroid => {
      asteroid.update(dt);

      //check for asteroids that are too far
      if (asteroid.checkOutOfBounds() || asteroid.hp <= 0) {
        asteroidsToRemove.push(asteroid);
      }

    });
    //remove asteroids
    this.asteroids = this.asteroids.filter(asteroid => !asteroidsToRemove.includes(asteroid));


    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      if (newBullet) {
        this.bullets.push(newBullet);
      }
    });

    // Apply collisions, 
    this.collisionHandler.applyCollisions(Object.values(this.players), this.bullets, this.asteroids); 
    
    // update list with dead bullets and give players score
    let destroyedBullets = [];
    this.bullets.forEach(
      b => {
        if (b.hp <= 0) {
          destroyedBullets.push(b);
          //give players score
          if (this.players[b.parentID]) {
            this.players[b.parentID].onDealtDamage();
          }
        }
      }
    );
    // remove dead bullets
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.VISION_RANGE,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.VISION_RANGE,
    );
    const nearbyAsteroids = this.asteroids.filter(  //choose asteroids that are close to the player
      b => b.distanceTo(player) <= Constants.VISION_RANGE,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      asteroids: nearbyAsteroids.map(b => b.serializeForUpdate()),  //return a list with serialized info of asteroids that are close to the player
      leaderboard,
    };
  }
}

module.exports = Game;
