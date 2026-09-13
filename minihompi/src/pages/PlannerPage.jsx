import { useState } from 'react'
import { usePlanner } from '../hooks/usePlanner.js'
import { usePoints } from '../contexts/PointsContext.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

const PLANNER_POINTS = 5

const CATEGORIES = [
  { key: 'todo', label: '할일', emoji: '✅', color: '#c8f4e0' },
  { key: 'homework', label: '숙제', emoji: '📓', color: '#ffe9b0' },
  { key: 'exam', label: '시험', emoji: '📝', color: '#ffd6e8' },
  { key: 'event', label: '일정', emoji: '📅', color: '#cfeeff' },
]

function categoryOf(key) {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[0]
}

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDate(iso) {
  const [, m, d] = iso.split('-')
  return `${Number(m)}월 ${Number(d)}일`
}

export default function PlannerPage() {
  const { items, loading, addItem, toggleDone, deleteItem } = usePlanner()
  const { award } = usePoints()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayISO())
  const [category, setCategory] = useState('todo')

  async function handleAdd() {
    if (!title.trim()) return
    await addItem(title.trim(), date, category)
    setTitle('')
  }

  async function handleToggle(item) {
    const nextDone = !item.done
    await toggleDone(item.id, nextDone)
    if (nextDone) await award(PLANNER_POINTS, `일정 완료: ${item.title}`, 'planner')
  }

  if (loading) return <LoadingScreen />

  const today = todayISO()
  const upcoming = items.filter((it) => !it.done && it.item_date >= today)
  const overdue = items.filter((it) => !it.done && it.item_date < today)
  const done = items.filter((it) => it.done)

  const groups = []
  let lastDate = null
  for (const it of upcoming) {
    if (it.item_date !== lastDate) {
      groups.push({ date: it.item_date, items: [] })
      lastDate = it.item_date
    }
    groups[groups.length - 1].items.push(it)
  }

  return (
    <div className="page stack">
      <h2 className="page-title">🗓️ 일정관리</h2>

      <div className="card stack">
        <input type="text" placeholder="할일이나 일정을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="row">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ flex: 1 }} />
        </div>
        <div className="row-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              className="btn"
              style={{ background: category === c.key ? c.color : '#f8f4ea', fontSize: 13 }}
              onClick={() => setCategory(c.key)}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        <button className="btn btn-block" onClick={handleAdd} disabled={!title.trim()}>➕ 추가하기</button>
      </div>

      {overdue.length > 0 && (
        <div className="card stack">
          <h3 style={{ fontSize: 13, color: '#e64545' }}>⏰ 지난 일정</h3>
          {overdue.map((it) => (
            <PlannerRow key={it.id} item={it} onToggle={handleToggle} onDelete={deleteItem} overdue />
          ))}
        </div>
      )}

      {groups.length === 0 && overdue.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', opacity: 0.6, fontSize: 13 }}>
          예정된 일정이 없어요. 위에서 새로 추가해보세요!
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.date} className="card stack">
            <h3 style={{ fontSize: 13 }}>{g.date === today ? `오늘 · ${formatDate(g.date)}` : formatDate(g.date)}</h3>
            {g.items.map((it) => (
              <PlannerRow key={it.id} item={it} onToggle={handleToggle} onDelete={deleteItem} />
            ))}
          </div>
        ))
      )}

      {done.length > 0 && (
        <div className="card stack">
          <h3 style={{ fontSize: 13, opacity: 0.6 }}>완료한 일정 ({done.length})</h3>
          {done.map((it) => (
            <PlannerRow key={it.id} item={it} onToggle={handleToggle} onDelete={deleteItem} />
          ))}
        </div>
      )}
    </div>
  )
}

function PlannerRow({ item, onToggle, onDelete, overdue }) {
  const cat = categoryOf(item.category)
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <div className="row" style={{ flex: 1, minWidth: 0 }}>
        <button
          onClick={() => onToggle(item)}
          style={{
            width: 26, height: 26, borderRadius: '50%', border: `2px solid ${cat.color}`,
            background: item.done ? cat.color : 'transparent', flexShrink: 0, cursor: 'pointer',
          }}
          aria-label="완료 체크"
        >
          {item.done ? '✓' : ''}
        </button>
        <span className="pill" style={{ background: cat.color, flexShrink: 0 }}>{cat.emoji} {cat.label}</span>
        <span
          style={{
            textDecoration: item.done ? 'line-through' : 'none',
            opacity: item.done ? 0.5 : 1,
            color: overdue ? '#e64545' : 'inherit',
            fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          {item.title}
        </span>
      </div>
      <button className="btn btn-ghost" style={{ minHeight: 32, minWidth: 32, padding: 0, fontSize: 14, flexShrink: 0 }} onClick={() => onDelete(item.id)} aria-label="삭제">
        ✕
      </button>
    </div>
  )
}
