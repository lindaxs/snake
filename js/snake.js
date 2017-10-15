/* Main js file that runs the game */
// var coord = require('./coordinate.js');
// alert(coord);
// var Coordinate = coord.Coordinate;


var snake; // Snake object, initialized in init()
var food;
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


/* Snake class for snake object. */
class Snake {
  constructor() {
    this.body = [new Coordinate(width/2, height/2)];
    this.length = 1;
  }

  moveBody(progress) {
    // shift each body part one forward
    for (var i = this.body.length - 1; i > 1; i--) {
      this.body[i] = this.body[i - 1];
    }
    // need to copy it over, otherwise will share the same address
    if (this.body.length > 1) {
      this.body[1] = this.body[0].copy();
    }
    // now move the head
    this.body[0].move(progress);
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

  // initialize snake & food object
  snake = new Snake();
  food = createFood();
}


/* Update position of snake. 
 * progress: variable of movement by _px
 */
function update(progress) {
  var head_x = snake.body[0].x;
  var head_y = snake.body[0].y;

  if ( isDead() ) {
    alert('dead');
    resetGame(); 
  }

  updateDirection();
  // moveBody only after key pressed
  if (up || down || left || right) {
    snake.moveBody(progress);
  }

  if(head_x == food.x && head_y == food.y) {
    growSnake();
    createFood(); // assign new coordinates
  }
}


/* This function randomly generates food */
function drawFood() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(food.x - 10, food.y - 10, side, side);
}


/* Generates new food with coordinates */
function createFood() {
  var inValid = true;
  
  // validates food coordinates
  while( inValid ) {
    // get new coordinates 
    var food_x = Math.floor(Math.random() * 625);
    var food_y = Math.floor(Math.random() * 625); 
   
    if (!inWall(food_x, food_y)) {
      for(var i = 0; i < snake.body.length; i++) {
        if (food_x == snake.body[i].x && food_y == snake.body[i].y) {
          continue;
        } // in snake
      } // check snake
    } // if not in Wall, check if in snake 

    // at this point in loop Food coordinates are valid
    inValid = false;
  }

  return new Coordinate(food_x, food_y);
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


/* Grows snake by 1 body unit after eating food */
function growSnake() {
  // Add food to head of snake
  var headCoord = snake.body[0];
  x = headCoord.x;
  y = headCoord.y;

  // if travelling up, add head to the top
  if (up) {
    snake.body.unshift(new Coordinate(x, y - side));
  } else if (down) {
    snake.body.unshift(new Coordinate(x, y + side));
  } else if (left) {
    snake.body.unshift(new Coordinate(x - side, y));
  } else if (right) {
    snake.body.unshift(new Coordinate(x + side, y));
  }
}


/* Resets the game when snake dies */
function resetGame() {

  // clear screen and reset coordinates
  ctx.clearRect(0, 0, width, height);
  snake = new Snake();

  // reset directions
  up = false;
  down = false;
  left = false;
  right = false;
}


/* Checks if any object hit a wall based on (x, y) coordinates */
function inWall(x, y) {
  var borderLen = 15 + side;

  // these denote the position of the wall
  var leftWall = borderLen;
  var rightWall = width - borderLen;
  var topWall = height - borderLen;
  var bottomWall = borderLen;

  if (x <= leftWall || x >= rightWall) {
    return true;
  } // coordinate in left or right wall
 
  if (y >= topWall || y <= bottomWall) {
    return true;
  } // coordinate in top or bottom wall
  
  return false; // no coordinate in walls
}


/* Checks whether snake has hit wall or self */
function isDead() {
  var head_x = snake.body[0].x;
  var head_y = snake.body[0].y;

  // checks if snake hit a wall
  if ( inWall(head_x, head_y) )
    return true;

  // loop through snake body and check for self-collisions, die if found
  for (var i = 1; i < snake.body.length; i++) {
    if (snake.body[i].x == head_x && snake.body[i].y == head_y) {
      return true;
    }
  }

  return false; // snake is not dead
}


/* Create the map borders, called by draw. */
function createMap() {
	ctx.fillStyle = 'black';

  // Create top and bottom borders.
  for (i = 0; i < width; i += side) {
    ctx.fillRect(i, 0, side, side);
    ctx.fillRect(i, height - side, side, side);
  }

  // Create left and right borders.
  for (i = 0; i < height; i += side) {
    ctx.fillRect(0, i, side, side);
    ctx.fillRect(width - side, i, side, side);
  }
}


/* Draws the snake */
function drawSnake() {
  ctx.fillStyle = 'red';
  for (var i = 0; i < snake.body.length; i++) {
    ctx.fillRect(snake.body[i].x - 10, snake.body[i].y - 10, side, side);
  }
}


/* Draw the map, snake, and food */
function draw() {

  // Draw the map.
  ctx.clearRect(0, 0, width, height);
  createMap();

  drawSnake();
  drawFood();

  // Draw Grid for TESTING purposes
  drawGrid();
}


/* This function's purpose is solely to test for coordinate alignment 
 * remove from main code after use
 */
function drawGrid() {
  var bw = 625;
  var bh = 625;

  // +1's needed for right border consistency
  var cw = bw + 1; 
  var ch = bh + 1;

  for (var x = 0; x <= bw; x += 25) {
    ctx.moveTo(0.5 + x, 0);
    ctx.lineTo(0.5 + x, bh);
  }
    
  for (var x = 0; x <= bh; x += 25) {
    ctx.moveTo(0, 0.5 + x);
    ctx.lineTo(bw, 0.5 + x);
  }

  ctx.strokeStyle = "grey";
  ctx.stroke();
}


var counter = 0;
var framesToSkip = 10;
var truth = true;


/* Main loop that updates position of snake and redraws board elements. */
function loop() {

	// We only update the snake every 10 frames. 
  if (counter < framesToSkip) {
    counter++;
    requestAnimationFrame(loop);
    return; // do not proceed until 10th frame
  }

  // Update the snake by 20 units.
  update(side);

  draw();
  counter = 0;
  window.requestAnimationFrame(loop);
}


init();
window.requestAnimationFrame(loop);

