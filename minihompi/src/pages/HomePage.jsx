import { useProfile } from '../hooks/useProfile.js'
import ProfileHeader from '../components/home/ProfileHeader.jsx'
import MoodPicker from '../components/home/MoodPicker.jsx'
import VisitorCounter from '../components/home/VisitorCounter.jsx'
import SkinPicker from '../components/home/SkinPicker.jsx'
import MenuGrid from '../components/home/MenuGrid.jsx'
import PointsBadge from '../components/common/PointsBadge.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

export default function HomePage() {
  const { profile, setProfile, loading } = useProfile()

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <ProfileHeader profile={profile} onProfileChange={setProfile} />
      <PointsBadge />
      <MoodPicker profile={profile} onProfileChange={setProfile} />
      <VisitorCounter />
      <SkinPicker />
      <MenuGrid />
    </div>
  )
}
