import { useEffect, useRef, useState } from 'react'
import { usePoints } from '../../contexts/PointsContext.jsx'
import { useGameReaction } from '../../hooks/useGameReaction.js'
import GameReactionCard from './GameReactionCard.jsx'

const HOLE_COUNT = 9
const GAME_SECONDS = 30

function rewardForScore(score) {
  if (score >= 25) return 25
  if (score >= 18) return 18
  if (score >= 12) return 12
  if (score >= 6) return 6
  return 3
}

export default function WhackAMoleGame({ onBack }) {
  const { award } = usePoints()
  const { reaction, react } = useGameReaction()
  const [started, setStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS)
  const [activeHole, setActiveHole] = useState(null)
  const [hitHole, setHitHole] = useState(null)
  const awardedRef = useRef(false)
  const moleTimeoutRef = useRef(null)
  const hitTimeoutRef = useRef(null)
  const startTimeRef = useRef(0)

  function scheduleMole() {
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const showDuration = Math.max(450, 1100 - elapsed * 20)
    const nextHole = Math.floor(Math.random() * HOLE_COUNT)
    setActiveHole(nextHole)
    moleTimeoutRef.current = setTimeout(() => {
      setActiveHole((cur) => (cur === nextHole ? null : cur))
      moleTimeoutRef.current = setTimeout(scheduleMole, 250 + Math.random() * 300)
    }, showDuration)
  }

  function start() {
    clearTimeout(moleTimeoutRef.current)
    clearTimeout(hitTimeoutRef.current)
    setStarted(true)
    setGameOver(false)
    setScore(0)
    setTimeLeft(GAME_SECONDS)
    setActiveHole(null)
    setHitHole(null)
    awardedRef.current = false
    startTimeRef.current = Date.now()
    scheduleMole()
  }

  useEffect(() => {
    if (!started || gameOver) return
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t)
          setGameOver(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [started, gameOver])

  useEffect(() => {
    if (gameOver) {
      clearTimeout(moleTimeoutRef.current)
      setActiveHole(null)
      if (!awardedRef.current) {
        awardedRef.current = true
        const reward = rewardForScore(score)
        award(reward, '두더지 잡기 게임', 'game_mole')
        react(reward / 25)
      }
    }
  }, [gameOver, score, award, react])

  useEffect(() => () => {
    clearTimeout(moleTimeoutRef.current)
    clearTimeout(hitTimeoutRef.current)
  }, [])

  function hitMole(index) {
    if (gameOver || index !== activeHole) return
    setScore((s) => s + 1)
    setActiveHole(null)
    setHitHole(index)
    hitTimeoutRef.current = setTimeout(() => setHitHole(null), 200)
  }

  return (
    <div className="page stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>◀ 목록으로</button>
        {started && !gameOver && <span className="pill">⏱ {timeLeft}초 · 점수 {score}</span>}
      </div>
      <h2 className="page-title">🔨 두더지 잡기</h2>

      {!started ? (
        <div className="card stack" style={{ alignItems: 'center' }}>
          <p style={{ fontWeight: 800, textAlign: 'center' }}>30초 동안 튀어나오는 두더지를 최대한 많이 잡아보세요!</p>
          <button className="btn" onClick={start}>시작하기</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {Array.from({ length: HOLE_COUNT }).map((_, i) => (
            <button
              key={i}
              onClick={() => hitMole(i)}
              disabled={gameOver}
              style={{
                aspectRatio: '1', borderRadius: '50%', border: 'none',
                background: '#c9a877', fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.25)',
                transform: hitHole === i ? 'scale(0.85)' : 'scale(1)',
                transition: 'transform 0.15s',
              }}
            >
              {activeHole === i ? '🐹' : ''}
            </button>
          ))}
        </div>
      )}

      {gameOver && (
        <div className="card stack" style={{ alignItems: 'center' }}>
          <p style={{ fontWeight: 800, fontSize: 18 }}>🎉 {score}마리 잡았어요!</p>
          <button className="btn" onClick={start}>다시하기</button>
          <GameReactionCard reaction={reaction} />
        </div>
      )}
    </div>
  )
}
