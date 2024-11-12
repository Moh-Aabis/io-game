// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection, updateInput } from './networking';

const input = {
  lcl: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

function onMouseMove(e) {
  handleDirection(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleDirection(touch.clientX, touch.clientY);
}

function onMouseDown(e) {
  if (e.button == 0) {
    input.lcl = true;
  }
  // console.log(input.lcl);
  updateInput(input.lcl);
}

function onMouseUp(e) {
  if (e.button == 0) {
    input.lcl = false;
  }
  // console.log(input.lcl);
  updateInput(input.lcl);
}

function onKeyDown(e) {
  if (e.keyCode == 87) {
    input.w = true;
  } else if (e.keyCode == 65) {
    input.a = true;
  } else if (e.keyCode == 83) {
    input.s = true;
  } else if (e.keyCode == 68) {
    input.d = true;
  }
  console.log(input);
}

function onKeyUp(e) {
  if (e.keyCode == 87) {
    input.w = false;
  } else if (e.keyCode == 65) {
    input.a = false;
  } else if (e.keyCode == 83) {
    input.s = false;
  } else if (e.keyCode == 68) {
    input.d = false;
  }
  console.log(input);
}

function handleDirection(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}


export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mousedown', onMouseDown);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
}
