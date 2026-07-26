import { Link } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile.js'
import { useGuestbook } from '../hooks/useGuestbook.js'
import ProfileHeader from '../components/home/ProfileHeader.jsx'
import MoodPicker from '../components/home/MoodPicker.jsx'
import VisitorCounter from '../components/home/VisitorCounter.jsx'
import SkinPicker from '../components/home/SkinPicker.jsx'
import MenuGrid from '../components/home/MenuGrid.jsx'
import PointsBadge from '../components/common/PointsBadge.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

export default function HomePage() {
  const { profile, setProfile, loading } = useProfile()
  const { entries: guestbookEntries } = useGuestbook()

  if (loading) return <LoadingScreen />

  const seenAt = profile.guestbook_seen_at ? new Date(profile.guestbook_seen_at).getTime() : 0
  const unreadGuestbook = guestbookEntries.filter((e) => new Date(e.created_at).getTime() > seenAt).length

  return (
    <div className="page stack">
      <ProfileHeader profile={profile} onProfileChange={setProfile} />
      <PointsBadge />
      {unreadGuestbook > 0 && (
        <Link
          to="/guestbook"
          className="card row"
          style={{ alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit', background: '#fff0f4' }}
        >
          <span style={{ fontSize: 22 }}>💌</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>새 방명록이 {unreadGuestbook}개 있어요! 확인해보세요</span>
        </Link>
      )}
      <MoodPicker profile={profile} onProfileChange={setProfile} />
      <VisitorCounter />
      <SkinPicker />
      <MenuGrid badges={{ '/guestbook': unreadGuestbook }} />
    </div>
  )
}
