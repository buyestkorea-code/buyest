import { NavLink } from 'react-router-dom'

export const NAV_ITEMS = [
  { to: '/', emoji: '🏠', label: '대문' },
  { to: '/diary', emoji: '📔', label: '일기장' },
  { to: '/pet', emoji: '🐣', label: '캐릭터' },
  { to: '/mission', emoji: '🗺️', label: '미션' },
  { to: '/album', emoji: '📷', label: '사진첩' },
]

export const MENU_ITEMS = [
  { to: '/diary', emoji: '📔', label: '일기장' },
  { to: '/album', emoji: '📷', label: '사진첩' },
  { to: '/mission', emoji: '🗺️', label: '오늘의 미션' },
  { to: '/miniroom', emoji: '🛋️', label: '미니룸' },
  { to: '/pet', emoji: '🐣', label: '캐릭터 키우기' },
  { to: '/memo', emoji: '📝', label: '메모장' },
  { to: '/guestbook', emoji: '💌', label: '방명록' },
  { to: '/profile', emoji: '🪪', label: '프로필' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <span className="nav-emoji">{item.emoji}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
