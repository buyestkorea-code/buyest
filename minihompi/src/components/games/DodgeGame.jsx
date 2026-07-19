import { useEffect, useRef, useState } from 'react'
import { usePoints } from '../../contexts/PointsContext.jsx'

const WIDTH = 320
const HEIGHT = 200
const GROUND_Y = 160
const CHAR_X = 50
const CHAR_SIZE = 28
const GRAVITY = 0.7
const JUMP_VELOCITY = -11

function rewardForScore(score) {
  if (score >= 60) return 25
  if (score >= 40) return 18
  if (score >= 25) return 12
  if (score >= 10) return 6
  return 3
}

export default function DodgeGame({ onBack }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const { award } = usePoints()
  const awardedRef = useRef(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)

  const stateRef = useRef(null)

  function resetState() {
    stateRef.current = {
      charY: GROUND_Y - CHAR_SIZE,
      velocity: 0,
      jumping: false,
      obstacles: [],
      speed: 3,
      elapsed: 0,
      nextSpawn: 60,
      frame: 0,
      over: false,
    }
  }

  function jump() {
    const s = stateRef.current
    if (!s || s.over) return
    if (!s.jumping) {
      s.velocity = JUMP_VELOCITY
      s.jumping = true
    }
  }

  function start() {
    resetState()
    setScore(0)
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

      s.velocity += GRAVITY
      s.charY += s.velocity
      if (s.charY >= GROUND_Y - CHAR_SIZE) {
        s.charY = GROUND_Y - CHAR_SIZE
        s.velocity = 0
        s.jumping = false
      }

      s.nextSpawn--
      if (s.nextSpawn <= 0) {
        const height = 26 + Math.random() * 20
        s.obstacles.push({ x: WIDTH, width: 18 + Math.random() * 10, height })
        s.nextSpawn = Math.max(35, 70 - Math.floor(s.elapsed / 8))
      }

      s.speed = 3 + s.elapsed / 200
      s.obstacles.forEach((o) => { o.x -= s.speed })
      s.obstacles = s.obstacles.filter((o) => o.x + o.width > 0)

      const charBottom = s.charY + CHAR_SIZE
      for (const o of s.obstacles) {
        const overlapX = CHAR_X + CHAR_SIZE > o.x && CHAR_X < o.x + o.width
        const overlapY = charBottom > GROUND_Y - o.height
        if (overlapX && overlapY) {
          s.over = true
          setGameOver(true)
        }
      }

      if (s.frame % 3 === 0) setScore(Math.floor(s.elapsed / 10))

      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.fillStyle = '#eaf8ff'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      ctx.fillStyle = '#e8c9a0'
      ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y)
      ctx.fillStyle = '#c9a877'
      ctx.fillRect(0, GROUND_Y, WIDTH, 4)

      ctx.font = `${CHAR_SIZE}px serif`
      ctx.fillText('🐣', CHAR_X, s.charY + CHAR_SIZE)

      ctx.font = '28px serif'
      s.obstacles.forEach((o) => {
        ctx.fillText('🌵', o.x, GROUND_Y)
      })

      if (!s.over) {
        rafRef.current = requestAnimationFrame(loop)
      }
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [started])

  useEffect(() => {
    if (gameOver && !awardedRef.current) {
      awardedRef.current = true
      award(rewardForScore(score), '장애물 피하기 게임', 'game_dodge')
    }
  }, [gameOver, score, award])

  function handleTap() {
    if (!started || gameOver) return
    jump()
  }

  return (
    <div className="page stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>◀ 목록으로</button>
        <span className="pill">점수 {score}</span>
      </div>
      <h2 className="page-title">🏃 장애물 피하기</h2>

      <div
        onClick={handleTap}
        onTouchStart={(e) => { e.preventDefault(); handleTap() }}
        style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '3px solid var(--color-peach)', touchAction: 'none' }}
      >
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ width: '100%', display: 'block' }} />

        {!started && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <p style={{ fontWeight: 800 }}>탭해서 점프! 선인장을 피해보세요</p>
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

      <p style={{ fontSize: 12, opacity: 0.6, textAlign: 'center' }}>화면을 탭하면 점프해요</p>
    </div>
  )
}
