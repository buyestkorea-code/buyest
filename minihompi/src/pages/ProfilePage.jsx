import { useProfile } from '../hooks/useProfile.js'
import ProfileForm from '../components/profile/ProfileForm.jsx'
import PointsBadge from '../components/common/PointsBadge.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'
import Mascot from '../components/common/Mascot.jsx'

export default function ProfilePage() {
  const { profile, setProfile, loading } = useProfile()

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <h2 className="page-title">🪪 프로필</h2>
      <div className="card stack" style={{ alignItems: 'center' }}>
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="프로필" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <Mascot size={72} mood="happy" />
        )}
        <strong>{profile?.nickname || '승목이'}</strong>
      </div>
      <PointsBadge />
      <ProfileForm profile={profile} onProfileChange={setProfile} />
    </div>
  )
}
