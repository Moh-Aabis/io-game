// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

let animationFrameRequestId;

function render() {
  const { me, others, bullets, asteroids } = getCurrentState();
  if (me) {
    const screenOriginWorldXY = {
      x:  me.x - canvas.width/2,
      y: me.y - canvas.height/2,
    };

    // Draw background
    const backgroundXY = transformXY({x: Constants.MAP_SIZE/2, y: Constants.MAP_SIZE/2}, screenOriginWorldXY);
    renderBackground(backgroundXY.x, backgroundXY.y);

    // Draw all bullets
    bullets.forEach(b => {
      renderBullet(b, screenOriginWorldXY);
    });

    // Draw asteroids
    asteroids.forEach(o => {
      renderAsteroid(o, screenOriginWorldXY);
    }); 

    // Draw all players
    renderPlayer(me);
    others.forEach(o => {
      renderOther(o, screenOriginWorldXY);
    });
  }

  // Rerun this render function on the next frame
  animationFrameRequestId = requestAnimationFrame(render);
}

function transformXY(object, origin) {
  return {
    x: object.x - origin.x,
    y: object.y - origin.y,
  }
}

function renderBackground(x, y) {
  const backgroundGradient = context.createRadialGradient(
    x,
    y,
    MAP_SIZE / 10,
    x,
    y,
    MAP_SIZE / 2,
  );
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1, 'gray');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(x - MAP_SIZE/2, y - MAP_SIZE/2, MAP_SIZE, MAP_SIZE);
}

function renderPlayer(player) {
  const x = canvas.width / 2, 
      y = canvas.height / 2,
      direction = player.direction;
  drawShip(x, y, direction);
  renderHealthBar(x, y, PLAYER_RADIUS, player.hp, PLAYER_MAX_HP);  
}

function renderOther(other, origin) {
  const { x, y } = transformXY(other, origin);
  const direction = other.direction;
  drawShip(x, y, direction);
  renderHealthBar(x, y, PLAYER_RADIUS, other.hp, PLAYER_MAX_HP);
}

function drawShip(x, y, direction) {
  context.save();
  context.translate(x, y);
  context.rotate(direction+Math.PI/2);
  context.drawImage(
    getAsset('ship.svg'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();
}

function renderHealthBar (canvasX, canvasY, radius, currentHP, maxHP) {
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - radius,
    canvasY + radius + 8,
    radius * 2,
    2,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - radius + radius * 2 * currentHP / maxHP,
    canvasY + radius + 8,
    radius * 2 * (1 - currentHP / maxHP),
    2,
  );
}

function renderBullet(bullet, origin) {
  const { x, y } = transformXY(bullet, origin);
  context.drawImage(
    getAsset('bullet.svg'),
    x - BULLET_RADIUS,
    y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

function renderAsteroid(asteroid, origin) { //draws the asteroid at the correct position on the screen compared to the player
  const { x, y } = transformXY(asteroid, origin);
  const r = asteroid.r;
  context.drawImage(
    getAsset('asteroid.svg'),
    x - r,
    y - r,
    r * 2,
    r * 2,
  );
  renderHealthBar(x, y, r, asteroid.hp, Constants.ASTEROID_HP);
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);

  // Rerun this render function on the next frame
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}

animationFrameRequestId = requestAnimationFrame(renderMainMenu);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(render);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}
