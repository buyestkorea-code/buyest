export default function StreakBadge({ streak }) {
  return (
    <div className="card row" style={{ justifyContent: 'center', gap: 8 }}>
      <span style={{ fontSize: 24 }}>🔥</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: 18 }}>{streak}일 연속</div>
        <div style={{ fontSize: 11, opacity: 0.6 }}>미션 스트릭</div>
      </div>
    </div>
  )
}
