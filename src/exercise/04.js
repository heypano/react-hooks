// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

const initialSquares = Array(9).fill(null)
function Board({squares, setSquares}) {
  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)
  const status = calculateStatus(winner, squares, nextValue)
  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }
    const newSquares = [...squares]
    newSquares[square] = nextValue
    setSquares(newSquares)
  }

  function restart() {
    setSquares(initialSquares)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  // 🐨 squares is the state for this component. Add useState for squares
  const [currentStep, setCurrentStep] = useLocalStorageState('step', 0)
  const [squares, setSquares] = useLocalStorageState('squares', [
    initialSquares,
  ])
  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={squares[currentStep]}
          setSquares={changedSquares => {
            const newSquares = [...squares.slice(0, currentStep + 1)]
            const newStep = currentStep + 1
            newSquares[newStep] = changedSquares
            setSquares(newSquares)
            setCurrentStep(newStep)
          }}
        />
      </div>
      <div style={{display: 'grid', gap: '10px'}}>
        {squares.map((square, step) => {
          const isCurrentStep = step === currentStep
          return (
            <button
              key={step}
              disabled={isCurrentStep}
              onClick={() => {
                setCurrentStep(step)
              }}
            >
              {isCurrentStep ? `Current Step ${step}` : `Go to Step ${step}`}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
