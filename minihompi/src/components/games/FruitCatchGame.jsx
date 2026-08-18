import { useEffect, useRef, useState } from 'react'
import { usePoints } from '../../contexts/PointsContext.jsx'
import { useGameReaction } from '../../hooks/useGameReaction.js'
import GameReactionCard from './GameReactionCard.jsx'

const WIDTH = 320
const HEIGHT = 400
const BASKET_WIDTH = 56
const BASKET_HEIGHT = 20
const BASKET_Y = HEIGHT - 30

const GOOD_ITEMS = ['🍎', '🍌', '🍇', '🍓', '🍊']
const BAD_EMOJI = '💣'

function rewardForScore(score) {
  if (score >= 30) return 25
  if (score >= 20) return 18
  if (score >= 12) return 12
  if (score >= 6) return 6
  return 3
}

export default function FruitCatchGame({ onBack }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const { award } = usePoints()
  const { reaction, react } = useGameReaction()
  const awardedRef = useRef(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const stateRef = useRef(null)

  function resetState() {
    stateRef.current = { basketX: WIDTH / 2, items: [], elapsed: 0, nextSpawn: 40, frame: 0, over: false, lives: 3, score: 0 }
  }

  function start() {
    resetState()
    setScore(0)
    setLives(3)
    setGameOver(false)
    setStarted(true)
    awardedRef.current = false
  }

  useEffect(() => {
    if (!started) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function loop() {
      const s = stateRef.current
      if (!s || s.over) return
      s.frame++
      s.elapsed++

      s.nextSpawn--
      if (s.nextSpawn <= 0) {
        const isBad = Math.random() < 0.22
        const emoji = isBad ? BAD_EMOJI : GOOD_ITEMS[Math.floor(Math.random() * GOOD_ITEMS.length)]
        s.items.push({ x: 20 + Math.random() * (WIDTH - 40), y: -20, emoji, bad: isBad })
        s.nextSpawn = Math.max(24, 55 - Math.floor(s.elapsed / 15))
      }

      const speed = 2 + s.elapsed / 300
      s.items.forEach((it) => { it.y += speed })

      const survivors = []
      for (const it of s.items) {
        const caught = it.y >= BASKET_Y - 10 && it.y <= BASKET_Y + 10 && Math.abs(it.x - s.basketX) < BASKET_WIDTH / 2
        if (caught) {
          if (it.bad) {
            s.lives -= 1
            setLives(s.lives)
            if (s.lives <= 0) {
              s.over = true
              setGameOver(true)
            }
          } else {
            s.score += 1
            setScore(s.score)
          }
          continue
        }
        if (it.y > HEIGHT + 20) continue
        survivors.push(it)
      }
      s.items = survivors

      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.fillStyle = '#eaf6ff'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      ctx.font = '26px serif'
      s.items.forEach((it) => { ctx.fillText(it.emoji, it.x - 13, it.y) })

      ctx.font = '30px serif'
      ctx.fillText('🧺', s.basketX - 15, BASKET_Y + BASKET_HEIGHT)

      if (!s.over) rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [started])

  useEffect(() => {
    if (gameOver && !awardedRef.current) {
      awardedRef.current = true
      const reward = rewardForScore(score)
      award(reward, '과일 받기 게임', 'game_fruit')
      react(reward / 25)
    }
  }, [gameOver, score, award, react])

  function handleMove(clientX) {
    const canvas = canvasRef.current
    if (!canvas || !stateRef.current) return
    const rect = canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * WIDTH
    stateRef.current.basketX = Math.min(WIDTH - BASKET_WIDTH / 2, Math.max(BASKET_WIDTH / 2, x))
  }

  return (
    <div className="page stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>◀ 목록으로</button>
        {started && <span className="pill">❤️ {lives} · 점수 {score}</span>}
      </div>
      <h2 className="page-title">🧺 과일 받기</h2>

      <div
        onTouchMove={(e) => { e.preventDefault(); handleMove(e.touches[0].clientX) }}
        onMouseMove={(e) => handleMove(e.clientX)}
        style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '3px solid var(--color-peach)', touchAction: 'none' }}
      >
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ width: '100%', display: 'block' }} />

        {!started && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <p style={{ fontWeight: 800, textAlign: 'center', padding: '0 20px' }}>바구니를 움직여서 과일을 받으세요! 폭탄💣은 피해야 해요</p>
            <button className="btn" onClick={start}>시작하기</button>
          </div>
        )}

        {gameOver && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <p style={{ fontWeight: 800 }}>게임 오버! 점수 {score}</p>
            <button className="btn" onClick={start}>다시하기</button>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, opacity: 0.6, textAlign: 'center' }}>화면을 손가락으로 드래그해서 바구니를 움직여요</p>
      {gameOver && <GameReactionCard reaction={reaction} />}
    </div>
  )
}
