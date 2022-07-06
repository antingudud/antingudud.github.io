const canvas = document.getElementById("board");
const context = canvas.getContext("2d");

// game configuration
let timeStop = false;
let speed = 4;
class wasPosition {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
let wasPos= [];
// snake configuration
class snakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const slider = document.getElementById('ranger');
const snakeParts = [];
let tailLength = 5;
let tileCount = 20;
let tileSize = 20;
let headX = 23;
let headY = 14;
let xVelocity = 0;
let yVelocity = 0;
// Apples
class appleCount {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
// initial values
let appleX = Math.floor(Math.random() * tileCount);
let appleY = Math.floor(Math.random() * tileCount);
let apples = [
  new appleCount(
        (appleX = Math.floor(Math.random() * 47)),
        (appleY = Math.floor(Math.random() * 29))),
  new appleCount(
        (appleX = Math.floor(Math.random() * 47)),
        (appleY = Math.floor(Math.random() * 29))),
  new appleCount(
        (appleX = Math.floor(Math.random() * 47)),
        (appleY = Math.floor(Math.random() * 29)))
      
];
// game function
let score = 0;

function drawBoard(w, h, canvas, context, spacing) {
  canvas.heigth = h;
  canvas.width = w;

  context.beginPath();

  context.strokeStyle = "red";
  context.lineWidth = 1;

  for (let x = 0; x <= w; x += spacing) {
    context.moveTo(x, 0);
    context.lineTo(x, h);
    for (let y = 0; y <= h; y += spacing) {
      context.moveTo(0, y);
      context.lineTo(w, y);
    }
  }
  context.stroke();
}

// game loop
function startLoop() {

}
function drawGame() {
  changeSnakePosition();
  let result = isGameOver();
  if ( result == true ) {
      return;
  }
  // bitesTheDust();
  clearScreen();
  // drawBoard(960, 600, canvas, context, 20);

  drawApple();
  checkAppleCollision();
  drawSnake();
  drawScore();
  console.log(slider.value);
  let handler = setTimeout(drawGame, 1000 / speed);
  if( timeStop == true ) {
    clearInterval(handler);
  }
}

// GAME FUNCTION
function isGameOver() {
    let gameOver = false;

    if ( yVelocity === 0 && xVelocity === 0 ) {
        return false;
    }

  if (headX < 0) {
    headX = 48;
  } else if (headX === 48 || headX > 48) {
    headX = 0;
  } else if (headY < 0) {
    headY = 30;
  } else if (headY === 30 || headY > 30) {
    headY = 0;
  }

//   Check snake body collision
  for ( let i = 0 ; i < snakeParts.length ; i++ ) {
    if( headX === snakeParts[i]["x"] && headY === snakeParts[i]["y"] ) {
        gameOver = true;
        break;
  }
}
if (gameOver == true) {
    const presentDiv = document.querySelector('div');
    const newDiv = document.createElement('div');
    const newH1 = document.createElement('h1');
    const loseText = document.createTextNode("GAME OVER");
    newDiv.appendChild(newH1);
    newH1.appendChild(loseText);
    presentDiv.appendChild(newDiv);
}

  return gameOver;
}

function bitesTheDust() {
  if( wasPos.length < 20 ) {
  wasPos.push(new wasPosition(headX, headY));
  }
  if( wasPos.length == 20 ) {
    wasPos.shift();
  }
  // console.log(wasPos);
  for( let i = 0; i < slider.value ; i++ ) {
    if(slider.value === 5) {
    headX = wasPos[i]["x"];
    headY = wasPos[i]["y"];
  }
  }
  
}

function drawScore() {
  const textInsertP = document.getElementById("score");
  textInsertP.innerText = "Score : " + score;
}

// SNAKE
function drawSnake() {
  context.fillStyle = "orange";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    context.fillRect(
      part.x * tileCount,
      part.y * tileCount,
      tileSize,
      tileSize
    );
  }

  snakeParts.push(new snakePart(headX, headY)); // Put an item at the end of the list next to the head
  if (snakeParts.length > tailLength) {
    snakeParts.shift(); // Remove the farthest item from the snake parts if have more than our tail size
  }
  context.fillStyle = "black";
  context.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}
function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function clearScreen() {
  context.fillStyle = "lightblue";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// Apple Functions

function checkAppleCollision() {
  // cek apabila posisi kepala ular ada di posisi apel
  for (let i = 0; i < apples.length; i++) {
    if (apples[i]["x"] === headX && apples[i]["y"] === headY) {
      // apples[i]["x"] = Math.floor(Math.random() * 47);
      // apples[i]["y"] = Math.floor(Math.random() * 29);
      apples.splice([i], 1);
      score++;
      tailLength++;
    }
  }
}
function createApple() {
  if (apples.length < 5) {
    apples.push(
      new appleCount(
        (appleX = Math.floor(Math.random() * 47)),
        (appleY = Math.floor(Math.random() * 29))
      )
    );
  }
}
setInterval(() => {
  createApple();
}, 3000);
function drawApple() {
  // Check if the apple is going to be drawn over the snake body
  for (let i = 0; i < snakeParts.length; i++) {
    for (let j = 0; j < apples.length; j++) {
      if (
        apples[j]["x"] === snakeParts[i]["x"] &&
        apples[j]["y"] === snakeParts[i]["y"]
      ) {
        // if true, remove the said apple
        apples.splice([j], 1);
      }
    }
  }
  context.fillStyle = "red";
  for (let i = 0; i < apples.length; i++) {
    context.fillRect(
      apples[i]["x"] * tileCount,
      apples[i]["y"] * tileCount,
      tileSize,
      tileSize
    );
  }
}

// Key event listener

document.body.addEventListener("keydown", keyDown);
function keyDown(event) {
  // Down
  if (event.keyCode == 38 || event.keyCode == 87) {
    if (yVelocity == 1) {
      return;
    } else if ( timeStop == true ) {
      console.log("Time is stopped, you can't move.")
      return;
    }
    yVelocity = -1;
    xVelocity = 0;
  }
  // Down
  if (event.keyCode == 40 || event.keyCode == 83) {
    if (yVelocity == -1) {
      return;
    } else if ( timeStop == true ) {
      console.log("Time is stopped, you can't move.")
      return;
    }
    yVelocity = 1;
    xVelocity = 0;
  }
  // Left
  if (event.keyCode == 37 || event.keyCode == 65) {
    if (xVelocity == 1) {
      return;
    } else if ( timeStop == true ) {
      console.log("Time is stopped, you can't move.")
      return;
    }
    yVelocity = 0;
    xVelocity = -1;
  }
  // Right
  if (event.keyCode == 39 || event.keyCode == 68) {
    if (xVelocity == -1) {
      return;
    } else if ( timeStop == true ) {
      console.log("Time is stopped, you can't move.")
      return;
    }
    yVelocity = 0;
    xVelocity = 1;
  }
  if (event.keyCode == 84) {
    timeStop = true;
  }
  if( event.keyCode == 89) {
    if( timeStop == true ) {
      timeStop = false;
      drawGame();
    } else {
      console.log("Time is running")
      return
    }
  }
}
xVelocity = 1;
drawGame();
