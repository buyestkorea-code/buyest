import { AR_MISSION_URL } from '../../config/arMission.js'
import Mascot from '../common/Mascot.jsx'

export default function MissionCard({ completed, onOpenAR, onComplete }) {
  return (
    <div className="card stack" style={{ alignItems: 'center', textAlign: 'center' }}>
      <Mascot size={100} mood={completed ? 'sparkle' : 'happy'} />
      <h3 style={{ fontSize: 18 }}>{completed ? '오늘 미션 완료! 🎉' : '오늘의 미션이 도착했어요!'}</h3>
      <p style={{ opacity: 0.7, fontSize: 13, margin: 0 }}>
        {completed ? '내일 또 새로운 미션이 기다리고 있어요.' : 'AR 사이트로 이동해서 미션을 해결해보세요.'}
      </p>
      <a href={AR_MISSION_URL} target="_blank" rel="noopener noreferrer" style={{ width: '100%', textDecoration: 'none' }} onClick={onOpenAR}>
        <button className="btn btn-block" style={{ background: 'var(--color-sky)' }}>🗺️ AR 미션 사이트로 이동</button>
      </a>
      <button className="btn btn-block" onClick={onComplete} disabled={completed}>
        {completed ? '✅ 다녀왔어요!' : '다녀왔어요! 완료하기'}
      </button>
    </div>
  )
}
