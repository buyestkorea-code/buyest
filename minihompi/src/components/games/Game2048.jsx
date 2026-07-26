import { useCallback, useEffect, useRef, useState } from 'react'
import { usePoints } from '../../contexts/PointsContext.jsx'
import { useGameReaction } from '../../hooks/useGameReaction.js'
import GameReactionCard from './GameReactionCard.jsx'

const SIZE = 4

const TILE_COLORS = {
  2: '#fff3d6', 4: '#ffe9b0', 8: '#ffd88a', 16: '#ffc266',
  32: '#ffab5e', 64: '#ff8f5e', 128: '#ffd6e8', 256: '#ffb7cf',
  512: '#ff9fc7', 1024: '#e6a9f0', 2048: '#c893e8',
}

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
}

function randomEmptyCell(board) {
  const empties = []
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) empties.push([r, c])
    }
  }
  if (empties.length === 0) return null
  return empties[Math.floor(Math.random() * empties.length)]
}

function spawnTile(board) {
  const cell = randomEmptyCell(board)
  if (!cell) return board
  const next = board.map((row) => [...row])
  next[cell[0]][cell[1]] = Math.random() < 0.9 ? 2 : 4
  return next
}

function compressLine(line) {
  const nonZero = line.filter((v) => v !== 0)
  let gained = 0
  const merged = []
  for (let i = 0; i < nonZero.length; i++) {
    if (nonZero[i] === nonZero[i + 1]) {
      const value = nonZero[i] * 2
      merged.push(value)
      gained += value
      i++
    } else {
      merged.push(nonZero[i])
    }
  }
  while (merged.length < SIZE) merged.push(0)
  return { line: merged, gained }
}

function rotateBoard(board) {
  const next = emptyBoard()
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      next[c][SIZE - 1 - r] = board[r][c]
    }
  }
  return next
}

function moveLeft(board) {
  let gained = 0
  let changed = false
  const next = board.map((row) => {
    const { line, gained: g } = compressLine(row)
    gained += g
    if (line.some((v, i) => v !== row[i])) changed = true
    return line
  })
  return { board: next, gained, changed }
}

function move(board, direction) {
  let rotated = board
  let rotations = { left: 0, down: 1, right: 2, up: 3 }[direction]
  for (let i = 0; i < rotations; i++) rotated = rotateBoard(rotated)
  const result = moveLeft(rotated)
  let resultBoard = result.board
  for (let i = 0; i < (4 - rotations) % 4; i++) resultBoard = rotateBoard(resultBoard)
  return { board: resultBoard, gained: result.gained, changed: result.changed }
}

function canMove(board) {
  for (const dir of ['left', 'right', 'up', 'down']) {
    if (move(board, dir).changed) return true
  }
  return false
}

function maxTile(board) {
  return Math.max(0, ...board.flat())
}

function rewardForTile(tile) {
  if (tile >= 1024) return 30
  if (tile >= 512) return 20
  if (tile >= 256) return 15
  if (tile >= 128) return 10
  if (tile >= 64) return 5
  return 3
}

export default function Game2048({ onBack }) {
  const [board, setBoard] = useState(() => spawnTile(spawnTile(emptyBoard())))
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const { award } = usePoints()
  const { reaction, react } = useGameReaction()
  const awardedRef = useRef(false)
  const touchStart = useRef(null)

  useEffect(() => {
    if (gameOver && !awardedRef.current) {
      awardedRef.current = true
      const reward = rewardForTile(maxTile(board))
      award(reward, '2048 게임', 'game_2048')
      react(reward / 30)
    }
  }, [gameOver, board, award, react])

  const handleMove = useCallback((direction) => {
    if (gameOver) return
    setBoard((prev) => {
      const result = move(prev, direction)
      if (!result.changed) return prev
      const spawned = spawnTile(result.board)
      setScore((s) => s + result.gained)
      if (!won && maxTile(spawned) >= 2048) setWon(true)
      if (!canMove(spawned)) setGameOver(true)
      return spawned
    })
  }, [gameOver, won])

  function restart() {
    setBoard(spawnTile(spawnTile(emptyBoard())))
    setScore(0)
    setGameOver(false)
    setWon(false)
    awardedRef.current = false
  }

  function onTouchStart(e) {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  function onTouchEnd(e) {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    if (Math.abs(dx) > Math.abs(dy)) {
      handleMove(dx > 0 ? 'right' : 'left')
    } else {
      handleMove(dy > 0 ? 'down' : 'up')
    }
  }

  return (
    <div className="page stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>◀ 목록으로</button>
        <span className="pill">점수 {score}</span>
      </div>
      <h2 className="page-title">🔢 2048</h2>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, background: '#e8c9a0',
          padding: 8, borderRadius: 14, touchAction: 'none', position: 'relative',
        }}
      >
        {board.flat().map((value, i) => (
          <div
            key={i}
            style={{
              aspectRatio: '1', borderRadius: 8, background: value ? TILE_COLORS[value] || '#8a4f8f' : '#f2ede0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: value >= 1000 ? 18 : 24, color: value >= 256 ? '#fff' : '#5b4636',
            }}
          >
            {value || ''}
          </div>
        ))}

        {(gameOver || won) && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <p style={{ fontWeight: 800, fontSize: 18 }}>{gameOver ? '게임 오버!' : '2048 달성! 🎉'}</p>
            {gameOver && <button className="btn" onClick={restart}>다시하기</button>}
            {won && !gameOver && <button className="btn btn-ghost" onClick={() => setWon(false)}>계속하기</button>}
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, opacity: 0.6, textAlign: 'center' }}>화면을 좌우/위아래로 스와이프해서 타일을 움직여보세요</p>
      {gameOver && <GameReactionCard reaction={reaction} />}
    </div>
  )
}
