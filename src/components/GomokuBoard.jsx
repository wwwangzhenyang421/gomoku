import { useRef, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

const BOARD_SIZE = 15
const CELL_SIZE = 35
const BOARD_PADDING = 30

export default function GomokuBoard({ board, onMove, winner, winningLine, currentPlayer, disabled = false }) {
  const canvasRef = useRef(null)
  const [hoveredCell, setHoveredCell] = useState(null)
  const { width } = useWindowSize()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    // 响应式尺寸：手机端全宽，桌面端最大600px
    const isMobile = width < 768
    const size = isMobile ? Math.min(width - 20, 500) : Math.min(width - 80, 600)
    canvas.width = size
    canvas.height = size

    drawBoard(ctx, canvas.width, canvas.height)
    drawStones(ctx, canvas.width, canvas.height, board, winningLine)
    if (hoveredCell && !winner && board[hoveredCell.row][hoveredCell.col] === 0 && currentPlayer === 1) {
      drawHover(ctx, canvas.width, canvas.height, hoveredCell, currentPlayer)
    }
  }, [board, winner, winningLine, hoveredCell, currentPlayer, width])

  const drawBoard = (ctx, width, height) => {
    // 饼干格子背景 - 纯色基础
    ctx.fillStyle = '#fef3c7'  // 温暖的米色
    ctx.fillRect(0, 0, width, height)

    // 绘制斜条纹格子 - 饼干格子风格
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.12)'
    ctx.lineWidth = 1.5
    const stripeSpacing = 25
    const angle = Math.PI / 4  // 45度角

    // 绘制从左下到右上的斜线
    for (let i = -height; i < width + height; i += stripeSpacing) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + height / Math.tan(angle), height)
      ctx.stroke()
    }

    // 绘制从左上到右下的斜线，形成格子
    for (let i = -width; i < width + height; i += stripeSpacing) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i + width * Math.tan(angle))
      ctx.stroke()
    }

    // 添加柔和的阴影效果
    ctx.shadowColor = 'rgba(146, 64, 14, 0.1)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 5

    const cellSize = (width - BOARD_PADDING * 2) / (BOARD_SIZE - 1)
    const startX = BOARD_PADDING
    const startY = BOARD_PADDING

    // 绘制柔和的网格线 - 像饼干的纹理线
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.25)'
    ctx.lineWidth = 1.2
    ctx.shadowBlur = 0

    for (let i = 0; i < BOARD_SIZE; i++) {
      // 横线
      ctx.beginPath()
      ctx.moveTo(startX, startY + i * cellSize)
      ctx.lineTo(startX + (BOARD_SIZE - 1) * cellSize, startY + i * cellSize)
      ctx.stroke()

      // 竖线
      ctx.beginPath()
      ctx.moveTo(startX + i * cellSize, startY)
      ctx.lineTo(startX + i * cellSize, startY + (BOARD_SIZE - 1) * cellSize)
      ctx.stroke()
    }

    // 绘制星位 - 像小饼干装饰
    const starPositions = [
      [3, 3], [3, 11], [11, 3], [11, 11], [7, 7]
    ]
    ctx.fillStyle = 'rgba(180, 83, 9, 0.4)'
    starPositions.forEach(([row, col]) => {
      const x = startX + col * cellSize
      const y = startY + row * cellSize
      // 绘制小圆点，像饼干上的装饰
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
      // 添加小光点
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.beginPath()
      ctx.arc(x - 1.5, y - 1.5, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(180, 83, 9, 0.4)'
    })
  }

  const drawStones = (ctx, width, height, board, winningLine) => {
    const cellSize = (width - BOARD_PADDING * 2) / (BOARD_SIZE - 1)
    const startX = BOARD_PADDING
    const startY = BOARD_PADDING
    const stoneRadius = cellSize * 0.42

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] !== 0) {
          const x = startX + col * cellSize
          const y = startY + row * cellSize
          const isWinning = winningLine?.some(
            pos => pos.row === row && pos.col === col
          )

          // 绘制柔和的阴影
          ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
          ctx.shadowBlur = 8
          ctx.shadowOffsetX = 2
          ctx.shadowOffsetY = 3

          // 绘制棋子
          if (board[row][col] === 1) {
            // 黑子
            const blackGradient = ctx.createRadialGradient(
              x - stoneRadius * 0.3, y - stoneRadius * 0.3,
              0,
              x, y, stoneRadius
            )
            blackGradient.addColorStop(0, '#666')
            blackGradient.addColorStop(1, '#000')
            ctx.fillStyle = blackGradient
          } else {
            // 白子
            const whiteGradient = ctx.createRadialGradient(
              x - stoneRadius * 0.3, y - stoneRadius * 0.3,
              0,
              x, y, stoneRadius
            )
            whiteGradient.addColorStop(0, '#fff')
            whiteGradient.addColorStop(1, '#ddd')
            ctx.fillStyle = whiteGradient
          }

          ctx.beginPath()
          ctx.arc(x, y, stoneRadius, 0, Math.PI * 2)
          ctx.fill()

          // 添加高光效果，让棋子更立体
          ctx.fillStyle = board[row][col] === 1 
            ? 'rgba(255, 255, 255, 0.15)' 
            : 'rgba(255, 255, 255, 0.6)'
          ctx.beginPath()
          ctx.arc(x - stoneRadius * 0.3, y - stoneRadius * 0.3, stoneRadius * 0.3, 0, Math.PI * 2)
          ctx.fill()

          // 重置阴影
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0

          // 高亮获胜棋子 - 金色光环
          if (isWinning) {
            ctx.strokeStyle = '#fbbf24'
            ctx.lineWidth = 4
            ctx.shadowColor = '#fbbf24'
            ctx.shadowBlur = 12
            ctx.beginPath()
            ctx.arc(x, y, stoneRadius + 3, 0, Math.PI * 2)
            ctx.stroke()
            ctx.shadowBlur = 0
          }
        }
      }
    }

    // 绘制获胜连线 - 金色星星效果
    if (winningLine && winningLine.length >= 5) {
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 5
      ctx.shadowColor = '#fbbf24'
      ctx.shadowBlur = 15
      ctx.beginPath()
      const first = winningLine[0]
      const last = winningLine[winningLine.length - 1]
      const x1 = startX + first.col * cellSize
      const y1 = startY + first.row * cellSize
      const x2 = startX + last.col * cellSize
      const y2 = startY + last.row * cellSize
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.shadowBlur = 0
    }
  }

  const drawHover = (ctx, width, height, cell, currentPlayer) => {
    const cellSize = (width - BOARD_PADDING * 2) / (BOARD_SIZE - 1)
    const startX = BOARD_PADDING
    const startY = BOARD_PADDING
    const x = startX + cell.col * cellSize
    const y = startY + cell.row * cellSize
    const stoneRadius = cellSize * 0.42

    ctx.globalAlpha = 0.4
    if (currentPlayer === 1) {
      // 黑子预览 - 半透明
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, stoneRadius)
      gradient.addColorStop(0, '#4a5568')
      gradient.addColorStop(1, '#1a202c')
      ctx.fillStyle = gradient
    } else {
      // 白子预览
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, stoneRadius)
      gradient.addColorStop(0, '#ffffff')
      gradient.addColorStop(1, '#edf2f7')
      ctx.fillStyle = gradient
    }
    ctx.beginPath()
    ctx.arc(x, y, stoneRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1.0
  }

  const getCellFromMouse = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const cellSize = (canvas.width - BOARD_PADDING * 2) / (BOARD_SIZE - 1)
    const startX = BOARD_PADDING
    const startY = BOARD_PADDING

    const col = Math.round((x - startX) / cellSize)
    const row = Math.round((y - startY) / cellSize)

    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      return { row, col }
    }
    return null
  }

  const handleMouseMove = (e) => {
    if (winner || disabled) {
      setHoveredCell(null)
      return
    }
    const cell = getCellFromMouse(e)
    setHoveredCell(cell)
  }

  const handleMouseLeave = () => {
    setHoveredCell(null)
  }

  const handleClick = (e) => {
    if (winner || disabled) return
    const cell = getCellFromMouse(e)
    if (cell && board[cell.row][cell.col] === 0) {
      onMove(cell.row, cell.col)
    }
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const cell = getCellFromTouch(touch)
    if (cell) {
      setHoveredCell(cell)
    }
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    const touch = e.changedTouches[0]
    const cell = getCellFromTouch(touch)
    if (cell && board[cell.row][cell.col] === 0 && !winner) {
      onMove(cell.row, cell.col)
    }
    setHoveredCell(null)
  }

  const getCellFromTouch = (touch) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const cellSize = (canvas.width - BOARD_PADDING * 2) / (BOARD_SIZE - 1)
    const startX = BOARD_PADDING
    const startY = BOARD_PADDING

    const col = Math.round((x - startX) / cellSize)
    const row = Math.round((y - startY) / cellSize)

    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      return { row, col }
    }
    return null
  }

  return (
    <div className="board-container w-full flex justify-center">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`board-canvas shadow-2xl rounded-3xl touch-none transition-all duration-300 ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:scale-[1.02]'}`}
        style={{
          maxWidth: '100%',
          height: 'auto',
          filter: 'drop-shadow(0 10px 25px rgba(146, 64, 14, 0.2))',
        }}
      />
    </div>
  )
}
