const canvas = document.getElementById("board");
const context = canvas.getContext("2d");
let inputField = document.getElementById('inputField');
let playBtn = document.getElementById('playBtn');
let slideRange = document.getElementById('rangeSlider');

// game configuration
let timeStop = false;
let speed = 7;
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
let prevXVelocity = xVelocity;
let prevYVelocity = yVelocity;
let gameOver = false;
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
let score = 6;

// Draws the board with checkered pattern
function drawBoard(w, h, canvas, context, spacing) {
  canvas.heigth = h;
  canvas.width = w;
  
  let squareCount = (w / spacing) * (h / spacing);
  // context.strokeStyle = "red";
  // context.lineWidth = 1;

  for(let i = 0 ; i < 30 ; i++) {
    for( let j = 0 ; j < 48 ; j++ ) {
      context.beginPath();
      context.fillStyle = ["#60b345ff", "#92cd7eff"][(i + j) % 2];
      context.fillRect(j * tileCount, i * tileCount, tileSize, tileSize);
      context.closePath();
    }
  }
}

// game loop
function startLoop() {

}
function drawGame() {
  // Prevent moving in the opposite direction

  // Was moving right but try to move left
  if(prevXVelocity === 1 && xVelocity === -1) {
    xVelocity = prevXVelocity;
  }
  // Was moving left but try to move right
  if(prevXVelocity === -1 && xVelocity === 1) {
    xVelocity = prevXVelocity;
  }
  // Was moving down but try to move up
  if(prevYVelocity === 1 && yVelocity === -1) {
    yVelocity = prevYVelocity;
  }
  // Was moving up but try to move down
  if(prevYVelocity === -1 && yVelocity === 1) {
    yVelocity = prevYVelocity;
  }

  prevXVelocity = xVelocity;
  prevYVelocity = yVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if ( result == true ) {
      return;
  }
  // bitesTheDust();
  clearScreen();
  timeTracker();
  drawBoard(canvas.clientWidth, canvas.clientHeight, canvas, context, 20);

  drawApple();
  checkAppleCollision();
  drawSnake();
  drawScore();
  let handler = setTimeout(drawGame, 1000 / speed);
  if( timeStop == true ) {
    clearTimeout(handler);
  }
}

// GAME FUNCTION
function isGameOver() {

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
    const newDiv = document.createElement('div');
    const newH1 = document.createElement('h1');
    const newP = document.createElement('p');
    const loseText = document.createTextNode("GAME OVER");
    const scoreTally = document.createTextNode("Score : " + score);
    newDiv.appendChild(newH1);
    newDiv.appendChild(newP);
    newH1.appendChild(loseText);
    newP.appendChild(scoreTally);
    newDiv.classList.add('gameOverInfo');
    gameBoard.insertBefore(newDiv, canvas);
}

  return gameOver;
}

// TIME FUNCTION
// setInterval(() => {
//   bitesTheDust();
// }, 1000 / speed);

function timeTracker() {
  if( wasPos.length < 20 ) {
  wasPos.push(new wasPosition(headX, headY));
  }
  if( wasPos.length == 20 ) {
    wasPos.shift();
  }
}

// function bitesTheDust() {
//   // console.log(wasPos);
//   // value 5 is selecting 1 second to roll back
//   // so move the head of the snake to where it was 1 second ago
//   // it's important to note that every second that has passed equals to
//   // 4 travelled grids. Currently this function only moves it to the previous
//   // grid instead of 4 grids.
//   if(slider.value == 5) {
//     headX = wasPos.at(-2)["x"];
//     headY = wasPos.at(-2)["y"];
//     return
//   }
  
// }

function Timer() {
  let timerStart = Date.now();
  let minuteCount = 0;
  let timerElement = document.getElementById('timer');

  setInterval(() => {
    timerDiff = Date.now() - timerStart;
    timePassed = Math.floor( timerDiff / 1000 );
    if( gameOver == false ) {

   
    if( timePassed < 60) {
  timerElement.innerText = "Time : " + minuteCount + ":" + timePassed;
      if (timePassed == 60 ) {
        timerStart = Date.now();
        timerElement.innerText = "Time : " + minuteCount + ":" + timePassed;
      }
    } else {
      timerStart = Date.now();
      minuteCount++;
    }
  }
    
  }, 1000);
}
function drawScore() {
  const textInsertP = document.getElementById("score");
  textInsertP.innerText = "Score : " + score;
}

// SNAKE
function drawSnake() {
  for (let i = 0; i < snakeParts.length; i++) {
    for(let j = 0; j < snakeParts.length; j++) {
      context.fillStyle = ["#5aa02c", "#447821"][(i + j) % 2];
    }
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
  context.fillStyle = "#2d5016";
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
function startApple() {
setInterval(() => {
  createApple();
}, 3000);
}

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

// HTML FUNCTION
// function toggleSlider() {
//   if ( slideRange.style.display === "none" ) {
//     slideRange.style.display = "block";
//     timeStop = true;
//   } else if (slideRange.style.display === 'block') {
//     slideRange.style.display = "none";
//     timeStop = false;
//     if( gameOver == true ) {
//       return;
//     }
//     drawGame();
//   }
// }

// Key event listener

function keyDown(event) {
  // Down
  if (event.keyCode == 38 || event.keyCode == 87) {
     if ( timeStop == true ) {
      console.log("Time is stopped, you can't move.");
      return;
    }
    yVelocity = -1;
    xVelocity = 0;
  }
  // Down
  if (event.keyCode == 40 || event.keyCode == 83) {
     if ( timeStop == true ) {
      console.log("Time is stopped, you can't move.");
      return;
    }
    yVelocity = 1;
    xVelocity = 0;
  }
  // Left
  if (event.keyCode == 37 || event.keyCode == 65) {
     if ( timeStop == true ) {
      console.log("Time is stopped, you can't move.");
      return;
    }
    yVelocity = 0;
    xVelocity = -1;
  }
  // Right
  if (event.keyCode == 39 || event.keyCode == 68) {
     if ( timeStop == true ) {
      console.log("Time is stopped, you can't move.");
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
// move east after game start
xVelocity = 1;
function startMenu() {
  let gameBoard = document.getElementById('gameBoard');

  inputField.addEventListener('input', function(e) {
  if( e.value == '' ) 
    playBtn.setAttribute('disabled', true);
   else if (e != '' ) 
    playBtn.removeAttribute('disabled');
  
  })
  gameBoard.style.display = "none";
}

inputField.addEventListener('input', function(e){
  if( e.target.value == '' )
  playBtn.setAttribute('disabled', true);
  else
  playBtn.removeAttribute('disabled');
})

window.addEventListener('load', function(){
  gameBoard.style.display = 'none';
});
playBtn.addEventListener('click', function(){
  let instructor = document.getElementById('instructor');
  instructor.style.display = 'none';
  gameBoard.style.display = 'block';
  drawGame();
  document.body.addEventListener("keydown", keyDown);
  startApple();
  Timer();
})