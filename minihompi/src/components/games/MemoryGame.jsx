import { useEffect, useMemo, useRef, useState } from 'react'
import { usePoints } from '../../contexts/PointsContext.jsx'

const EMOJI_SET = ['🍎', '🍓', '🍇', '🍊', '🐶', '🐱', '🐰', '🐥']

function shuffledDeck() {
  const deck = [...EMOJI_SET, ...EMOJI_SET].map((emoji, i) => ({ id: i, emoji, matched: false }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export default function MemoryGame({ onBack }) {
  const [deck, setDeck] = useState(shuffledDeck)
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [busy, setBusy] = useState(false)
  const { award } = usePoints()
  const awardedRef = useRef(false)

  const complete = useMemo(() => deck.every((c) => c.matched), [deck])

  useEffect(() => {
    if (complete && !awardedRef.current) {
      awardedRef.current = true
      const pairs = EMOJI_SET.length
      const efficiency = Math.min(1, pairs / Math.max(moves, 1))
      const reward = Math.round(8 + efficiency * 12)
      award(reward, '카드 짝맞추기 게임', 'game_memory')
    }
  }, [complete, moves, award])

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
    setDeck(shuffledDeck())
    setFlipped([])
    setMoves(0)
    setBusy(false)
    awardedRef.current = false
  }

  return (
    <div className="page stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>◀ 목록으로</button>
        <span className="pill">시도 {moves}</span>
      </div>
      <h2 className="page-title">🃏 카드 짝맞추기</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {deck.map((card, i) => {
          const isOpen = card.matched || flipped.includes(i)
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(i)}
              style={{
                aspectRatio: '1', borderRadius: 12, border: 'none', fontSize: 28,
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
          <p style={{ fontWeight: 800 }}>🎉 완성! {moves}번 만에 다 맞췄어요</p>
          <button className="btn" onClick={restart}>다시하기</button>
        </div>
      )}
    </div>
  )
}
