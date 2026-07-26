import { useEffect, useMemo, useRef, useState } from 'react'
import { usePoints } from '../../contexts/PointsContext.jsx'
import { useGameProgress } from '../../hooks/useGameProgress.js'
import { useGameReaction } from '../../hooks/useGameReaction.js'
import GameReactionCard from './GameReactionCard.jsx'
import LoadingScreen from '../common/LoadingScreen.jsx'

const EMOJI_POOL = ['🍎', '🍓', '🍇', '🍊', '🐶', '🐱', '🐰', '🐥', '🦋', '🌈', '🍭', '🎈']
const MAX_PAIRS = EMOJI_POOL.length

function pairsForStage(stage) {
  return Math.min(6 + (stage - 1) * 2, MAX_PAIRS)
}

function shuffledDeck(pairs) {
  const emojis = EMOJI_POOL.slice(0, pairs)
  const deck = [...emojis, ...emojis].map((emoji, i) => ({ id: i, emoji, matched: false }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export default function MemoryGame({ onBack }) {
  const { level: stage, loading, advanceLevel } = useGameProgress('memory')
  const pairs = pairsForStage(stage)
  const [deck, setDeck] = useState(null)
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [busy, setBusy] = useState(false)
  const { award } = usePoints()
  const { reaction, react } = useGameReaction()
  const awardedRef = useRef(false)

  useEffect(() => {
    if (!loading) setDeck(shuffledDeck(pairs))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, stage])

  const complete = useMemo(() => deck?.every((c) => c.matched) ?? false, [deck])

  useEffect(() => {
    if (complete && !awardedRef.current) {
      awardedRef.current = true
      const efficiency = Math.min(1, pairs / Math.max(moves, 1))
      const reward = Math.round(8 + efficiency * 12 + stage * 2)
      award(reward, `카드 짝맞추기 게임 (스테이지 ${stage})`, 'game_memory')
      react(efficiency)
    }
  }, [complete, moves, award, react, pairs, stage])

  function handleFlip(index) {
    if (busy || flipped.includes(index) || deck[index].matched) return
    const nextFlipped = [...flipped, index]
    setFlipped(nextFlipped)

    if (nextFlipped.length === 2) {
      setBusy(true)
      setMoves((m) => m + 1)
      const [a, b] = nextFlipped
      if (deck[a].emoji === deck[b].emoji) {
        setTimeout(() => {
          setDeck((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)))
          setFlipped([])
          setBusy(false)
        }, 400)
      } else {
        setTimeout(() => {
          setFlipped([])
          setBusy(false)
        }, 800)
      }
    }
  }

  function restart() {
    setDeck(shuffledDeck(pairs))
    setFlipped([])
    setMoves(0)
    setBusy(false)
    awardedRef.current = false
  }

  async function nextStage() {
    await advanceLevel()
    setFlipped([])
    setMoves(0)
    setBusy(false)
    awardedRef.current = false
    setDeck(shuffledDeck(pairsForStage(stage + 1)))
  }

  if (loading || !deck) return <LoadingScreen />

  const columns = pairs * 2 >= 20 ? 5 : 4

  return (
    <div className="page stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>◀ 목록으로</button>
        <span className="pill">스테이지 {stage} · 시도 {moves}</span>
      </div>
      <h2 className="page-title">🃏 카드 짝맞추기</h2>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 8 }}>
        {deck.map((card, i) => {
          const isOpen = card.matched || flipped.includes(i)
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(i)}
              style={{
                aspectRatio: '1', borderRadius: 12, border: 'none', fontSize: columns === 5 ? 22 : 28,
                background: isOpen ? '#fff' : 'var(--color-pink)',
                boxShadow: card.matched ? '0 0 0 2px #7cd992' : '0 2px 6px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isOpen ? card.emoji : ''}
            </button>
          )
        })}
      </div>

      {complete && (
        <div className="card stack" style={{ alignItems: 'center' }}>
          <p style={{ fontWeight: 800 }}>🎉 스테이지 {stage} 완성! {moves}번 만에 다 맞췄어요</p>
          <div className="row">
            <button className="btn btn-ghost" onClick={restart}>다시하기</button>
            {pairs < MAX_PAIRS && <button className="btn" onClick={nextStage}>다음 스테이지 ▶</button>}
          </div>
          <GameReactionCard reaction={reaction} />
        </div>
      )}
    </div>
  )
}
