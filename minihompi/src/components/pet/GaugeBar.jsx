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
  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
        <span>{LABELS[type]}</span>
        <span>{value}%</span>
      </div>
      <div className="gauge-track">
        <div className="gauge-fill" style={{ width: `${value}%`, background: COLORS[type] }} />
      </div>
    </div>
  )
}
