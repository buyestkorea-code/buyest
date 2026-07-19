const COLORS = {
  hunger: '#ffb84d',
  cleanliness: '#4dd0e1',
  happiness: '#ff6b9d',
}

const LABELS = {
  hunger: '🍚 배고픔',
  cleanliness: '🛁 청결',
  happiness: '😊 행복',
}

export default function GaugeBar({ type, value }) {
  const isCritical = value < 30
  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
        <span>{LABELS[type]}</span>
        <span style={{ color: isCritical ? '#e64545' : 'inherit', fontWeight: isCritical ? 800 : 400 }}>{value}%</span>
      </div>
      <div className="gauge-track">
        <div className="gauge-fill" style={{ width: `${value}%`, background: isCritical ? '#e64545' : COLORS[type] }} />
      </div>
    </div>
  )
}
