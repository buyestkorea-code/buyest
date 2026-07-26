import { Link } from 'react-router-dom'
import { MENU_ITEMS } from '../common/BottomNav.jsx'

export default function MenuGrid({ badges = {} }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: 12 }}>메뉴</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {MENU_ITEMS.map((item) => {
          const badgeCount = badges[item.to]
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                textDecoration: 'none', color: 'inherit', padding: '10px 4px',
                borderRadius: 14, background: 'var(--color-yellow)', minHeight: 64, justifyContent: 'center',
              }}
            >
              {Boolean(badgeCount) && (
                <span
                  style={{
                    position: 'absolute', top: 2, right: 6, background: '#ff5b6e', color: '#fff',
                    fontSize: 10, fontWeight: 800, borderRadius: 999, minWidth: 16, height: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                  }}
                >
                  {badgeCount > 9 ? '9+' : badgeCount}
                </span>
              )}
              <span style={{ fontSize: 26 }}>{item.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
