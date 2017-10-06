/* Main js file that runs the game */
// var coord = require('./coordinate.js');
// alert(coord);
// var Coordinate = coord.Coordinate;


var snake; // Snake object, initialized in init()
var canvas, ctx, width, height;
// var position; // x, y coordinates of snake head
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

  /* move method, used for the head.
  * progress: distance of movement
  */
  move(progress) {
    if (up) {
      this.y -= progress;
    }
    else if (down) {
      this.y += progress;
    }
    else if (left) {
      this.x -= progress;
    }
    else if (right) {
      this.x += progress;
    }
  }

  // copy method
  copy() {
    return new Coordinate(this.x, this.y);
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
  // initialize snake object
  snake = {
    // starting position of snake
    body:[new Coordinate(width/2, height/2)],
    length:1, // starting length of just head
    moveBody: function(progress) {
      // shift each body part one forward
      for (var i = this.body.length - 1; i > 1; i--) {
        this.body[i] = this.body[i - 1];
      }
      // need to copy it over, otherwise will share the same address
      this.body[1] = this.body[0].copy();
      // now move the head
      this.body[0].move(progress);
    },
    // for testing purposes for now
    growSnake: function(num) {
      var lastCoord = this.body[this.body.length - 1];
      x = lastCoord.x;
      y = lastCoord.y;
      // add squares behind head
      for (var i = 1; i < num; i++) {
        this.body.push(new Coordinate(x - i * side, y));
        snake.length++;
      }
    }
  };
}


/* Update position of snake. 
 * progress: variable of movement by _px
 */
function update(progress) {
  if ( isDead() ) {
    return;
    resetGame(); 
  }

  updateDirection();
  // moveBody only after key pressed
  if (up || down || left || right) {
    snake.moveBody(progress);
  }
  
}


/* This function adds movement to the snake in a given direction
 * progress denotes movement value in px
 */
// function move(progress) {
//   if (up) {
//     position.y -= progress;
//   }
//   else if (down) {
//     position.y += progress;
//   }
//   else if (left) {
//     position.x -= progress;
//   }
//   else if (right) {
//     position.x += progress;
//   }
// }


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
  snake.body[0].x = width/2;
  snake.body[0].y = height/2;

  // reposition snake
  ctx.fillStyle = 'red';
  ctx.fillRect(snake.body[0].x - 10, snake.body[0].y - 10, side, side);

  // reset directions
  prevKey = -1;
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

  if (snake.body[0].x <= leftWall || snake.body[0].x >= rightWall) {
    return true;
  } // snake hits left or right wall
 
  if (snake.body[0].y >= topWall || snake.body[0].y <= bottomWall) {
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
  for (var i = 0; i < snake.body.length; i++) {
    ctx.fillRect(snake.body[i].x - 10, snake.body[i].y - 10, side, side);
  }
  
}

var counter = 0;
var framesToSkip = 10;

/* Main loop that updates position of snake and redraws. 
 *  timestamp: current time 
 */
function loop(timestamp) {

	// To advance the snake 20 units, we only update the 
  // snake every 10 frames. 
  if (counter < framesToSkip) {
    counter++;
    requestAnimationFrame(loop);
    draw();
    return; // do not proceed until 10th frame
  }
  update(side);

  draw();
  counter = 0;
  window.requestAnimationFrame(loop);
}

init();
snake.growSnake(10); // for testing
// draw();
window.requestAnimationFrame(loop);

