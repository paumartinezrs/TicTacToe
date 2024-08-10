import confetti from "canvas-confetti"
import { useState } from "react"
import { Square } from "./components/Square.jsx"
import { Board } from "./components/Board.jsx"

import { TURNS } from "./constants.js"
import { checkWinner, checkEndGame } from "./logic/Board.js"
import { WinnerModal } from "./components/WinnerModal.jsx"


function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : useState(Array(9).fill(null))
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ? JSON.parse(turnFromStorage) : TURNS.X 
  })
  const [winner, setWinner] = useState(null) //null -> no hay ganador, false -> empate

  const resetGame = () => {
    const initBoard = Array(9).fill(null)
    const initTurn = TURNS.X
    setBoard(initBoard)
    setTurn(initTurn)
    setWinner(null)
    window.localStorage.removeItemItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return 

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', JSON.stringify(newTurn))

    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
      <main className="board">
        <h1>TicTacToe</h1>
        <button onClick={resetGame}>Reset game</button>
        <Board board={board} updateBoard={updateBoard}/>

        <section className="turn">
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        </section>

        <WinnerModal winner={winner} resetGame={resetGame}/>
      </main>
  )
}

export default App
