import { useMemo, useState } from 'react'
import { useDiaryEntries } from '../hooks/useDiaryEntries.js'
import { usePoints } from '../contexts/PointsContext.jsx'
import { todayKey } from '../utils/dateFormat.js'
import DiaryCalendar from '../components/diary/DiaryCalendar.jsx'
import DiaryEntryForm from '../components/diary/DiaryEntryForm.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

const DIARY_POINTS = 15

export default function DiaryPage() {
  const { entries, loading, upsertEntry, deleteEntry } = useDiaryEntries()
  const { award } = usePoints()
  const [selectedDate, setSelectedDate] = useState(todayKey())

  const existingEntry = useMemo(
    () => entries.find((e) => e.entry_date === selectedDate) || null,
    [entries, selectedDate]
  )

  async function handleSave(fields, isNew) {
    await upsertEntry(selectedDate, fields)
    if (isNew) {
      await award(DIARY_POINTS, '일기 작성', 'diary')
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <h2 className="page-title">📔 일기장</h2>
      <DiaryCalendar entries={entries} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <DiaryEntryForm
        key={selectedDate}
        dateKey={selectedDate}
        existingEntry={existingEntry}
        onSave={handleSave}
        onDelete={deleteEntry}
      />
    </div>
  )
}
