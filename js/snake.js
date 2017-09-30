/* Main js file that runs the game */

var canvas, ctx, width, height;
var position; // x, y coordinates of snake head
var direction; // direction of snake movement, dependent on key press

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
* progress: direction of movement?
*/
function update(progress) {
  position.x += progress;
  // Game over possibilities
  if (position.x > (width - side)) {
    // Game over
  }
}

/* Create the map borders, called by draw. */
function createMap() {
	ctx.fillStyle = 'black';
  // Create top and bottom borders.
  for (i = 0; i < width; i+=side) {
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

/* Main loop that updates position of snake and redraws. 
* timestamp: current time 
*/
function loop() {

	// TODO: should be updating by 20 units at a time
	// Need to slow Animation frame rate or it is too fast
  update(1); // currently moves to the right
  draw();
  window.requestAnimationFrame(loop);
}

init();
window.requestAnimationFrame(loop);

