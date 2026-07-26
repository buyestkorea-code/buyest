import { useState } from 'react'

const PRICE = 20

function weightedPick(items) {
  const weights = items.map((item) => 1 / Math.max(1, item.price))
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

export default function GachaBox({ catalog, ownedIds, currentPoints, onSpend, onAcquire, renderIcon }) {
  const [result, setResult] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const pool = catalog.filter((item) => !ownedIds.has(item.id))
  const affordable = currentPoints >= PRICE
  const disabled = spinning || pool.length === 0 || !affordable

  async function pull() {
    if (disabled) return
    setSpinning(true)
    setResult(null)
    const ok = await onSpend(PRICE, '랜덤 뽑기', 'gacha')
    if (!ok) { setSpinning(false); return }
    const picked = weightedPick(pool)
    await onAcquire(picked)
    setTimeout(() => {
      setResult(picked)
      setSpinning(false)
    }, 900)
  }

  return (
    <div className="card stack" style={{ alignItems: 'center', background: 'linear-gradient(135deg, #fff3d6, #ffe3ef)' }}>
      <h3 style={{ fontSize: 14 }}>🎰 랜덤 뽑기</h3>
      <p style={{ fontSize: 12, opacity: 0.7, textAlign: 'center' }}>
        {pool.length === 0
          ? '이미 모든 아이템을 다 모았어요! 🎉'
          : `${PRICE}P 를 내면 안 가진 아이템 중 하나가 랜덤으로 나와요`}
      </p>
      <button className="btn" disabled={disabled} onClick={pull}>
        {spinning ? '두구두구...' : `뽑기 (${PRICE}P)`}
      </button>
      {result && (
        <div className="stack" style={{ alignItems: 'center', marginTop: 6 }}>
          <p style={{ fontWeight: 800, fontSize: 13 }}>🎉 당첨!</p>
          <div style={{ fontSize: 36 }}>{renderIcon(result)}</div>
          <p style={{ fontWeight: 700, fontSize: 13 }}>{result.name}</p>
        </div>
      )}
    </div>
  )
}
