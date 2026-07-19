import { useVisitorCounter } from '../../hooks/useVisitorCounter.js'

export default function VisitorCounter() {
  const { today, total } = useVisitorCounter()

  return (
    <div className="card row" style={{ justifyContent: 'space-around', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{today}</div>
        <div style={{ fontSize: 11, opacity: 0.6 }}>오늘 방문</div>
      </div>
      <div style={{ width: 1, height: 30, background: '#eee' }} />
      <div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{total}</div>
        <div style={{ fontSize: 11, opacity: 0.6 }}>전체 방문</div>
      </div>
    </div>
  )
}
