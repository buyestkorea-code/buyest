import Mascot from './Mascot.jsx'

export default function EmptyState({ message = '아직 아무것도 없어요!', mood = 'neutral' }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
      <Mascot size={72} mood={mood} />
      <p style={{ margin: 0, opacity: 0.7 }}>{message}</p>
    </div>
  )
}
