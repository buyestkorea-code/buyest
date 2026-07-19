import { Route, Routes } from 'react-router-dom'
import { PointsProvider } from './contexts/PointsContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import BottomNav from './components/common/BottomNav.jsx'
import LevelUpEffect from './components/common/LevelUpEffect.jsx'
import { isSupabaseConfigured } from './lib/supabaseClient.js'
import HomePage from './pages/HomePage.jsx'
import DiaryPage from './pages/DiaryPage.jsx'
import AlbumPage from './pages/AlbumPage.jsx'
import MissionPage from './pages/MissionPage.jsx'
import MiniRoomPage from './pages/MiniRoomPage.jsx'
import PetPage from './pages/PetPage.jsx'
import MemoPage from './pages/MemoPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import GuestbookPage from './pages/GuestbookPage.jsx'

function SupabaseWarningBanner() {
  if (isSupabaseConfigured) return null
  return (
    <div style={{ background: '#ffe1e1', color: '#a33', padding: '8px 16px', fontSize: 12, textAlign: 'center' }}>
      ⚠️ Supabase가 아직 연결되지 않았어요. minihompi/.env 에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 를 설정해주세요. (지금은 저장이 되지 않아요)
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <PointsProvider>
        <div className="app-shell">
          <SupabaseWarningBanner />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/album" element={<AlbumPage />} />
            <Route path="/mission" element={<MissionPage />} />
            <Route path="/miniroom" element={<MiniRoomPage />} />
            <Route path="/pet" element={<PetPage />} />
            <Route path="/memo" element={<MemoPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
          </Routes>
          <BottomNav />
          <LevelUpEffect />
        </div>
      </PointsProvider>
    </ThemeProvider>
  )
}
