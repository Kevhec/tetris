function checkCollision(board, shape, desiredMove) {
  if (!shape) return

  const pieceBoardXPos = desiredMove.x;
  const pieceBoardYPos = desiredMove.y;

  // If desired move is off the board then there's a true collition
  const hasCollision = shape.find((row, y) => {
    return row.find((cell, x) => {
      return (
        cell !== 0 &&
        board[y + pieceBoardYPos]?.[x + pieceBoardXPos] !== 0
      )
    })
  })

  return hasCollision;
}

export default checkCollision;