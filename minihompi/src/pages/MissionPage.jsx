import { useMissionLog } from '../hooks/useMissionLog.js'
import { usePoints } from '../contexts/PointsContext.jsx'
import { AR_MISSION_POINTS } from '../config/arMission.js'
import MissionCard from '../components/mission/MissionCard.jsx'
import StreakBadge from '../components/mission/StreakBadge.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

export default function MissionPage() {
  const { loading, todayLog, completeToday, streak } = useMissionLog()
  const { award } = usePoints()

  async function handleComplete() {
    const created = await completeToday()
    if (created) await award(AR_MISSION_POINTS, 'AR 미션 완료', 'mission')
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <h2 className="page-title">🗺️ 오늘의 미션</h2>
      <MissionCard completed={Boolean(todayLog)} onComplete={handleComplete} />
      <StreakBadge streak={streak} />
    </div>
  )
}
