import { useState, useEffect } from 'react'
import GomokuBoard from './components/GomokuBoard'
import GameControls from './components/GameControls'
import StartScreen from './components/StartScreen'
import PageTransition from './components/PageTransition'
import { getAIMove } from './utils/gomokuAI'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const [board, setBoard] = useState(() => 
    Array(15).fill(null).map(() => Array(15).fill(0))
  )
  const [currentPlayer, setCurrentPlayer] = useState(1) // 1 = 人类(黑子), -1 = AI(白子)
  const [winner, setWinner] = useState(null)
  const [history, setHistory] = useState([])
  const [winningLine, setWinningLine] = useState(null)
  const [isAIThinking, setIsAIThinking] = useState(false)

  // AI自动下棋
  useEffect(() => {
    if (gameStarted && currentPlayer === -1 && !winner && !isAIThinking) {
      setIsAIThinking(true)
      // 添加延迟，让AI思考看起来更自然
      setTimeout(() => {
        const aiMove = getAIMove(board, -1)
        if (aiMove && aiMove.row !== undefined && aiMove.col !== undefined) {
          makeMove(aiMove.row, aiMove.col, -1)
        }
        setIsAIThinking(false)
      }, 300)
    }
  }, [currentPlayer, board, winner, gameStarted, isAIThinking])

  const makeMove = (row, col, player) => {
    // 边界检查
    if (row < 0 || row >= 15 || col < 0 || col >= 15) return
    if (board[row] === undefined || board[row][col] === undefined) return
    if (board[row][col] !== 0 || winner) return

    const newBoard = board.map(r => [...r])
    newBoard[row][col] = player
    setBoard(newBoard)
    setHistory([...history, { row, col, player }])

    // 检查胜负
    const winLine = checkWinner(newBoard, row, col, player)
    if (winLine) {
      setWinner(player)
      setWinningLine(winLine)
    } else {
      setCurrentPlayer(-player)
    }
  }

  const handleMove = (row, col) => {
    // 只允许人类（黑子）下棋
    if (currentPlayer !== 1 || board[row][col] !== 0 || winner || isAIThinking) return
    makeMove(row, col, 1)
  }

  const handleUndo = () => {
    if (history.length === 0 || winner || isAIThinking) return

    // 找到人类（黑子，player=1）的最后一步
    let lastHumanMoveIndex = -1
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].player === 1) {
        lastHumanMoveIndex = i
        break
      }
    }

    // 如果没有找到人类的步数，不能悔棋
    if (lastHumanMoveIndex === -1) return

    // 需要撤销从最后一步到人类最后一步之间的所有步数（包括AI的步数）
    const movesToUndo = history.length - lastHumanMoveIndex
    const newBoard = board.map(r => [...r])
    
    // 撤销这些步数
    for (let i = history.length - 1; i >= lastHumanMoveIndex; i--) {
      const move = history[i]
      newBoard[move.row][move.col] = 0
    }

    setBoard(newBoard)
    setHistory(history.slice(0, lastHumanMoveIndex))
    setCurrentPlayer(1) // 悔棋后轮到人类下
    setWinner(null)
    setWinningLine(null)
    setIsAIThinking(false)
  }

  const handleReset = () => {
    setBoard(Array(15).fill(null).map(() => Array(15).fill(0)))
    setCurrentPlayer(1)
    setWinner(null)
    setHistory([])
    setWinningLine(null)
    setIsAIThinking(false)
  }

  const handleStartGame = () => {
    setShowTransition(true)
  }

  const handleTransitionComplete = () => {
    setGameStarted(true)
    setShowTransition(false)
    setBoard(Array(15).fill(null).map(() => Array(15).fill(0)))
    setCurrentPlayer(1)
    setWinner(null)
    setHistory([])
    setWinningLine(null)
    setIsAIThinking(false)
  }

  const handleToggleFirstPlayer = () => {
    if (history.length > 0) return // 只能在游戏开始前切换
    setCurrentPlayer(-currentPlayer)
  }

  const checkWinner = (board, row, col, player) => {
    const directions = [
      [[0, 1], [0, -1]],   // 横向
      [[1, 0], [-1, 0]],   // 纵向
      [[1, 1], [-1, -1]],  // 主对角线
      [[1, -1], [-1, 1]]   // 副对角线
    ]

    for (const [forward, backward] of directions) {
      let count = 1
      const line = [{ row, col }]

      // 向前检查
      let r = row + forward[0]
      let c = col + forward[1]
      while (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === player) {
        count++
        line.push({ row: r, col: c })
        r += forward[0]
        c += forward[1]
      }

      // 向后检查
      r = row + backward[0]
      c = col + backward[1]
      while (r >= 0 && r < 15 && c >= 0 && c < 15 && board[r][c] === player) {
        count++
        line.unshift({ row: r, col: c })
        r += backward[0]
        c += backward[1]
      }

      if (count >= 5) {
        return line
      }
    }

    return null
  }

  if (!gameStarted) {
    return (
      <>
        {!showTransition && <StartScreen onStart={handleStartGame} />}
        {showTransition && <PageTransition onComplete={handleTransitionComplete} />}
      </>
    )
  }

  return (
    <div className="app-container">
      <div className="game-wrapper">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 bg-clip-text text-transparent melt-text block">
            五子棋
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-amber-600 melt-text block" style={{ animationDelay: '0.1s' }}>
            Gomoku
          </h2>
        </div>
        <div className="game-info mb-4 text-center">
          <p className="text-xl md:text-2xl font-bold text-amber-800">
            {isAIThinking 
              ? 'AI思考中...'
              : winner 
                ? `${winner === 1 ? '黑子' : '白子(AI)'} 获胜！` 
                : `${currentPlayer === 1 ? '您下棋(黑子)' : 'AI下棋'}`}
          </p>
        </div>
        <GomokuBoard 
          board={board}
          onMove={handleMove}
          winner={winner}
          winningLine={winningLine}
          currentPlayer={currentPlayer}
          disabled={currentPlayer !== 1 || isAIThinking}
        />
        <GameControls
          onUndo={handleUndo}
          onReset={handleReset}
          onToggleFirstPlayer={handleToggleFirstPlayer}
          canUndo={history.length > 0 && !winner && !isAIThinking}
          canToggleFirst={history.length === 0}
        />
      </div>
    </div>
  )
}

export default App