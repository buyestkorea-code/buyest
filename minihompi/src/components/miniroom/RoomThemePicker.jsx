import { WALLPAPER_THEMES, FLOOR_THEMES } from './RoomBackdrop.jsx'

export default function RoomThemePicker({ theme, onChange }) {
  return (
    <div className="card stack">
      <h3 style={{ fontSize: 14 }}>🎨 방 테마 꾸미기</h3>
      <div>
        <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>벽지</p>
        <div className="row">
          {Object.entries(WALLPAPER_THEMES).map(([key, t]) => (
            <button
              key={key}
              className="btn"
              style={{ flex: 1, background: t.bg, border: theme.wallpaper === key ? '2px solid var(--color-pink)' : '2px solid transparent' }}
              onClick={() => onChange({ wallpaper: key })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>바닥</p>
        <div className="row">
          {Object.entries(FLOOR_THEMES).map(([key, t]) => (
            <button
              key={key}
              className="btn"
              style={{ flex: 1, background: t.base, border: theme.floor === key ? '2px solid var(--color-pink)' : '2px solid transparent' }}
              onClick={() => onChange({ floor: key })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
