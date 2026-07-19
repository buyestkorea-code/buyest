import { usePoints } from '../../contexts/PointsContext.jsx'

export default function PointsBadge() {
  const { stats, nextLevelAt, progressInLevel, POINTS_PER_LEVEL } = usePoints()
  const pct = Math.round((progressInLevel / POINTS_PER_LEVEL) * 100)

  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="pill">⭐ Lv.{stats.level}</span>
        <span className="pill">🍬 {stats.current_points}P</span>
      </div>
      <div className="gauge-track" style={{ marginTop: 8 }}>
        <div className="gauge-fill" style={{ width: `${pct}%`, background: 'var(--color-pink)' }} />
      </div>
      <p style={{ fontSize: 11, opacity: 0.6, marginTop: 4, marginBottom: 0 }}>
        다음 레벨까지 {nextLevelAt - stats.total_points}P
      </p>
    </div>
  )
}
