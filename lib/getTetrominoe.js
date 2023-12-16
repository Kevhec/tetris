import { tetrominoes } from './constants.js';

// Closure to avoid global variables
function getRandomTetrominoeClosure() {
  // Initialize empty tetrimony bag
  let bag = []

  const fillBag = () => {
    // Get a copy of tetrimonies
    bag = [...tetrominoes];
    
    // Implement a Fisher-Yates shuffle
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }
  
  return (boardWidth) => {
    // If bag is empty refill it
    if (bag.length === 0) {
      fillBag();
    }

    // Draw the first element of the bag
    const base = bag.shift();
    const maxX = boardWidth - 4;
    const minX = 2

    const tetrominoe = {
      ...base,
      x: Math.floor(Math.random() * ( maxX - minX )) + minX,
      y: 0,
    }
    // return this element
    return tetrominoe;
  }
}

export default getRandomTetrominoeClosure;