/* Main js file that runs the game */

var canvas, ctx, width, height;
var position; // x, y coordinates of snake head
// direction of snake movement, dependent on key press
var direction = 1; // -1 is down, 0 left, 1 up, 2 right

var left = false;
var right = false;
var up = false;
var down = false;

const side = 20; // size of each box's side

/* Coordinate class
* x: x coordinate
* y: y coordinate 
*/
class Coordinate {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}


/* Gets canvas from html and puts in 2d context */
function initializeCanvas() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
}


/* Initialize canvas from html. */
function init() {
	initializeCanvas();
	width = canvas.width;
	height = canvas.height;
	// starting position of snake
	position = new Coordinate(width/2, height/2) 
}


/* Update position of snake. 
 * progress: variable of movement by _px
 */
function update(progress) {
  if ( isDead() ) {
    resetGame(); 
  }

  updateDirection();
  move(progress);
}


/* This function adds movement to the snake in a given direction
 * progress denotes movement value in px
 */
function move(progress) {
  if (up) {
    position.y -= progress;
  }
  else if (down) {
    position.y += progress;
  }
  else if (left) {
    position.x -= progress;
  }
  else if (right) {
    position.x += progress;
  }
}


/* This function updates snake's direction */
function updateDirection() {
  document.addEventListener('keydown', function(event) {

    if (event.keyCode == 38 && !down) { 
      up = true;
      down = false;
      left = false;
      right = false;
      direction = 1;
    } // up
    else if (event.keyCode == 40 && !up) { 
      up = false;
      down = true;
      left = false;
      right = false;
      direction = 1;
    } // down
    else if (event.keyCode == 37 && !right) { 
      up = false;
      down = false;
      left = true;
      right = false;
      direction = 0;
    } // left
    else if (event.keyCode == 39 && !left) {
      up = false;
      down = false;
      left = false;
      right = true;
      direction = 2;
    } // right

  }); // snake's current direction
}


/* Resets the game when snake dies */
function resetGame() {

  // clear screen and reset coordinates
  ctx.clearRect(0, 0, width, height);
  position.x = width/2;
  position.y = height/2;

  // reposition snake
  ctx.fillStyle = 'red';
  ctx.fillRect(position.x - 10, position.y - 10, side, side);

  // reset directions
  up = false;
  down = false;
  left = false;
  right = false;
}


/* Currently checks whether the snake has hit a wall */
function isDead() {
  var borderLen = 10 + side;

  // these denote the position of the wall
  var leftWall = borderLen;
  var rightWall = width - borderLen;
  var topWall = height - borderLen;
  var bottomWall = borderLen;

  if (position.x <= leftWall || position.x >= rightWall) {
    return true;
  } // snake hits left or right wall
 
  if (position.y >= topWall || position.y <= bottomWall) {
    return true;
  } // snake hits top or bottom wall

  return false; // snake is not dead
}


/* Create the map borders, called by draw. */
function createMap() {
	ctx.fillStyle = 'black';

  // Create top and bottom borders.
  for (i = 0; i < width; i += side) {
    ctx.fillRect(i, 0, side, side);
    ctx.fillRect(i, height-side, side, side);
  }

  // Create left and right borders.
  for (i = 0; i < height; i+=side) {
    ctx.fillRect(0, i, side, side);
    ctx.fillRect(width-side, i, side, side);
  }
}


/* Draw the map and snake. */
function draw() {

  ctx.clearRect(0, 0, width, height);
  createMap();

  // Draw snake (so far only one square).
  ctx.fillStyle = 'red';
  ctx.fillRect(position.x - 10, position.y - 10, side, side);
}

// var framesThisSecond = 0;
// var lastFpsUpdate = 0;
var timestep = 1000 / 60;
var fps = 60;
var delta = 0;
var lastRender = 0;
/* Main loop that updates position of snake and redraws. 
 *  timestamp: current time 
 */
function loop(timestamp) {

	// TODO: should be updating by 20 units at a time
	// Need to slow Animation frame rate or it is too fast
  update(3);
  // if (timestamp < lastRender + (1000 / fps)) {
  //   requestAnimationFrame(loop);
  //   return;
  // }
  // delta += timestamp - lastRender;
  // lastRender = timestamp;

  // while (delta >= timestep) {
  //   update(timestep); // currently moves to the right
  //   delta -= timestep;
  // }
  draw();
  window.requestAnimationFrame(loop);
}

init();

window.requestAnimationFrame(loop);

