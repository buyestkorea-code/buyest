import { useMemo, useState } from 'react'
import { toDateKey, todayKey } from '../../utils/dateFormat.js'

export default function DiaryCalendar({ entries, selectedDate, onSelectDate }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date(selectedDate)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const stampByDate = useMemo(() => {
    const map = {}
    for (const e of entries) map[e.entry_date] = e.mood_emoji || '✅'
    return map
  }, [entries])

  const weeks = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1)
    const startWeekday = first.getDay()
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < startWeekday; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    const rows = []
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
    return rows
  }, [cursor])

  function changeMonth(delta) {
    setCursor((prev) => {
      let month = prev.month + delta
      let year = prev.year
      if (month < 0) { month = 11; year -= 1 }
      if (month > 11) { month = 0; year += 1 }
      return { year, month }
    })
  }

  const today = todayKey()

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <button className="btn btn-ghost" onClick={() => changeMonth(-1)}>◀</button>
        <strong>{cursor.year}년 {cursor.month + 1}월</strong>
        <button className="btn btn-ghost" onClick={() => changeMonth(1)}>▶</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontSize: 11, textAlign: 'center', opacity: 0.5, marginBottom: 4 }}>
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {weeks.flat().map((day, i) => {
          if (!day) return <div key={i} />
          const dateKey = toDateKey(new Date(cursor.year, cursor.month, day))
          const stamp = stampByDate[dateKey]
          const isSelected = dateKey === selectedDate
          const isToday = dateKey === today
          return (
            <button
              key={i}
              onClick={() => onSelectDate(dateKey)}
              style={{
                aspectRatio: '1', borderRadius: 10, border: isToday ? '2px solid var(--color-peach)' : '1px solid #eee',
                background: isSelected ? 'var(--color-pink)' : '#fffdf8',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: isSelected ? 800 : 500, padding: 0,
              }}
            >
              <span>{day}</span>
              {stamp && <span style={{ fontSize: 13 }}>{stamp}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
