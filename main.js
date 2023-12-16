import { colors } from './lib/constants.js';
import getRandomTetrominoeClosure from './lib/getTetrominoe.js';
import checkCollision from './lib/handleCollisions.js';

// Game State
let gamePhase = 'waiting'
let currentTetrominoe = {}

let dropTime = 1000;
let timePassed = 0;
let lastTimestamp;

let score = 0;

// Configuration
const cellSize = 40;
const boardWidth = 10;
const boardHeight = 16;
const canvasWidth = cellSize * boardWidth;
const canvasHeight = cellSize * boardHeight;

// Create board
let board;

function createBoard() {
  board = Array(boardHeight)
  .fill()
  .map(() => Array(boardWidth).fill(0));

  console.table(board);
}

// Get tetrominoe helper function's closure;
const getTetrominoe = getRandomTetrominoeClosure();

/**
 * @type {HTMLCanvasElement | null}
 */
const canvas = document.getElementById('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Get drawing context
const ctx = canvas.getContext('2d');

// Scale canvas
ctx.scale(cellSize, cellSize)

const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start');

// Initialize layout
resetGame();

function resetGame() {
  gamePhase = 'waiting';
  createBoard();
  currentTetrominoe = {};
  dropTime = 1000;
  timePassed = 0;
  score = 0;

  startButton.style.display = 'block';
  scoreElement.innerText = score;

  draw();
}

// Set event listeners
window.addEventListener('keydown', (evt) => {
  if (evt.repeat) return;
  const keyPressed = evt.key;

  if (keyPressed === 'ArrowLeft') {
    moveTetronimoeOnX('left')
  }
  
  if (keyPressed === 'ArrowRight') {
    moveTetronimoeOnX('right')
  }

  if (keyPressed === 'ArrowUp') {
    rotateTetronimoe();
  }

  if (keyPressed === 'ArrowDown') {
    dropToBottom();
  }
})

startButton.addEventListener('click', (evt) => {
  if (gamePhase === 'waiting' || gamePhase === 'gameover') {
    resetGame();
    startButton.style.display = 'none';
    gamePhase = 'playing';
    lastTimestamp = undefined;
    window.requestAnimationFrame(mainLoop);
  }
})

function mainLoop(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    window.requestAnimationFrame(mainLoop);
    return
  }

  switch (gamePhase) {
    case 'waiting':
      return
    case 'playing':
      if (!currentTetrominoe.shape) {
        currentTetrominoe = getTetrominoe(boardWidth);
      }

      const deltaTime = timestamp - lastTimestamp;
      timePassed += deltaTime;
    
      handleVerticalMovement();
      break
    case 'gameover':
      drawGameOver();
      return
  }

  draw();
  window.requestAnimationFrame(mainLoop);

  lastTimestamp = timestamp;
}

function handleVerticalMovement() {
  const collision = checkCollision(
    board,
    currentTetrominoe?.shape,
    {
    x: currentTetrominoe.x,
    y: currentTetrominoe.y + 1,
  })

  if (!collision && timePassed > dropTime) {
    currentTetrominoe.y ++;
    timePassed = 0;
  } else if (collision) {
    // Make the current tetrominoe to be part of the board
    placeTetrominoOnBoard();

    // Reset drop time in case keydown was pressed
    setDropTime(1000);

    // Check if there's any full line
    const fullLines = checkForFullLines();

    // Calculate score based on full lines
    handleScore(fullLines);

    // Get new tetrominoe
    currentTetrominoe = getTetrominoe(boardWidth);

    // Check game over by looking for overlap of the new tetrominoe
    // and the existing on board
    checkGameOver();
  }
}

function moveTetronimoeOnX(direction) {
  // Select direction for movement
  const dir = direction === 'left' ? -1 : 1;

  if (currentTetrominoe.shape) {
    // Save the shape's new desired position
    const newX = currentTetrominoe.x + 1 * dir;

    const hasCollision = checkCollision(
      board,
      currentTetrominoe?.shape,
      {
        x: newX,
        y: currentTetrominoe.y,
      }
    )

    // Check if the position is available
    if (!hasCollision) {
      // Change the x value to the new state
      currentTetrominoe.x = newX;
    }
  }
}

function rotateTetronimoe() {
  if (currentTetrominoe.shape) {
    const prevShape = currentTetrominoe.shape;

    const newShape = prevShape[0].map((_, i) => (
      prevShape.map(row => row[i]).reverse()
    ))

    currentTetrominoe.shape = newShape;

    const hasCollision = checkCollision(
      board,
      currentTetrominoe?.shape,
      {
        x: currentTetrominoe.x,
        y: currentTetrominoe.y
      }
    )

    if (hasCollision) {
      currentTetrominoe.shape = prevShape;
    }
  }
}

function dropToBottom() {
  if (currentTetrominoe.shape) {
    // Highly increase drop rate
    setDropTime(1);
  }
}

function setDropTime(ms) {
  dropTime = ms;
}

function placeTetrominoOnBoard() {
  if (!currentTetrominoe.shape) return;
  const tetrominoeX = currentTetrominoe.x;
  const tetrominoeY = Math.ceil(currentTetrominoe.y);

  currentTetrominoe.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== 0) {
        board[tetrominoeY + y][tetrominoeX + x] = currentTetrominoe.color.code;
      }
    })
  })

  console.table(board);
}

function checkForFullLines() {
  let fullLineCount = 0;
  board.forEach((row, i) => {
    let isFullLine = true;
    row.forEach(cell => {
      if (cell === 0) {
        isFullLine = false;
      }
    })

    if (isFullLine) {
      fullLineCount++
      board.splice(i, 1);
      board.unshift(row.fill(0));
    }
  })
  
  return fullLineCount;
}

function handleScore(fullLinesCount) {
  let addToScore;

  switch (fullLinesCount) {
    case 1:
      addToScore = 40
      break
    case 2:
      addToScore = 100
      break
    case 3:
      addToScore = 300
      break
    case 4:
      addToScore = 1200
      break
    default:
      addToScore = 0;
  }

  score += addToScore;
  scoreElement.innerText = score
}

function checkGameOver() {
  const hasCollision = checkCollision(
    board,
    currentTetrominoe?.shape,
    {
      x: currentTetrominoe.x,
      y: currentTetrominoe.y
    }
  )

  if (hasCollision) {
    gamePhase = 'gameover';
  }
}

function drawCurrentTetrominoe() {
  ctx.save();
  if (currentTetrominoe.shape) {
    ctx.translate(currentTetrominoe.x, currentTetrominoe.y);

    currentTetrominoe.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          ctx.fillStyle = currentTetrominoe.color.value;
          ctx.fillRect(x, y, 1, 1)
/*           ctx.strokeStyle = 'black'
          ctx.strokeRect(x, y, 1, 1) */
        }
      })
    })
  }
  ctx.restore();
}

function drawBoard() {
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== 0) {
        const color = Object.values(colors).find(color => color.code === cell)?.value;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1)
        /* ctx.strokeStyle = 'black'
        ctx.strokeRect(x, y, 1, 1) */
      }
    })
  })
}

function drawGameOver() {
  ctx.clearRect(0, 0, boardWidth, boardHeight);

  // Paint background
  ctx.fillStyle = "#0f0f0f";
  ctx.fillRect(0, 0, boardWidth, boardHeight);

  ctx.fillStyle = "white";
  ctx.font = "1px serif"
  ctx.textAlign = "center"
  ctx.fillText('Game Over', Math.floor(boardWidth / 2), Math.floor(boardHeight / 3))

  startButton.style.display = 'block';
}

function draw() {
  ctx.clearRect(0, 0, boardWidth, boardHeight);

  // Paint background
  ctx.fillStyle = "#0f0f0f";
  ctx.fillRect(0, 0, boardWidth, boardHeight);

  // Paint current tetrominoe
  drawBoard();
  drawCurrentTetrominoe();
}