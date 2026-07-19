import { useTheme } from '../../contexts/ThemeContext.jsx'

export default function SkinPicker() {
  const { skin, setSkin, skins } = useTheme()

  return (
    <div className="card">
      <h3 style={{ marginBottom: 8, fontSize: 14 }}>미니홈피 스킨</h3>
      <div className="row-wrap">
        {Object.entries(skins).map(([key, s]) => (
          <button
            key={key}
            className="btn"
            style={{
              background: s.accent,
              boxShadow: skin === key ? '0 0 0 3px var(--skin-text)' : 'none',
              fontSize: 12,
            }}
            onClick={() => setSkin(key)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
