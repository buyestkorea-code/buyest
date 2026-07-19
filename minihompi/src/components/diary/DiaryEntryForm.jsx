import { useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured } from '../../lib/supabaseClient.js'
import { uploadToBucket } from '../../lib/storage.js'
import { publicUrl } from '../../lib/storage.js'
import { formatKoreanDate } from '../../utils/dateFormat.js'
import { usePoints } from '../../contexts/PointsContext.jsx'
import DoodlePad from './DoodlePad.jsx'

const WEATHERS = ['☀️', '🌤️', '☁️', '🌧️', '⛈️', '❄️']
const MOODS = ['😆', '😊', '😐', '😢', '😡', '🥳']

export default function DiaryEntryForm({ dateKey, existingEntry, onSave, onDelete }) {
  const [content, setContent] = useState('')
  const [weather, setWeather] = useState('☀️')
  const [mood, setMood] = useState('😊')
  const [showDoodle, setShowDoodle] = useState(false)
  const [saving, setSaving] = useState(false)
  const doodleRef = useRef(null)

  useEffect(() => {
    setContent(existingEntry?.content || '')
    setWeather(existingEntry?.weather || '☀️')
    setMood(existingEntry?.mood_emoji || '😊')
    setShowDoodle(Boolean(existingEntry?.doodle_path))
  }, [existingEntry, dateKey])

  async function handleSave() {
    setSaving(true)
    try {
      let doodlePath = existingEntry?.doodle_path || null
      if (showDoodle && doodleRef.current && isSupabaseConfigured) {
        const blob = await doodleRef.current.toBlob()
        if (blob) {
          const path = `${dateKey}.png`
          await uploadToBucket('doodles', path, blob, 'image/png')
          doodlePath = path
        }
      }
      const isNew = !existingEntry
      await onSave({ content, weather, mood_emoji: mood, doodle_path: doodlePath }, isNew)
    } finally {
      setSaving(false)
    }
  }

  const doodleUrl = existingEntry?.doodle_path ? publicUrl('doodles', existingEntry.doodle_path) : null

  return (
    <div className="card stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong>{formatKoreanDate(dateKey)}</strong>
        {existingEntry && (
          <button className="btn btn-ghost" style={{ fontSize: 12, minHeight: 36, padding: '6px 10px' }} onClick={() => onDelete(existingEntry.id)}>
            🗑️ 삭제
          </button>
        )}
      </div>

      <div>
        <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>오늘 날씨</p>
        <div className="row-wrap">
          {WEATHERS.map((w) => (
            <button key={w} className="btn" style={{ fontSize: 20, padding: 6, minWidth: 44, background: weather === w ? 'var(--color-sky)' : '#f8f4ea' }} onClick={() => setWeather(w)}>
              {w}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>오늘 기분</p>
        <div className="row-wrap">
          {MOODS.map((m) => (
            <button key={m} className="btn" style={{ fontSize: 20, padding: 6, minWidth: 44, background: mood === m ? 'var(--color-pink)' : '#f8f4ea' }} onClick={() => setMood(m)}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <textarea placeholder="오늘 있었던 일을 적어보세요!" value={content} onChange={(e) => setContent(e.target.value)} />

      <button className="btn btn-secondary" onClick={() => setShowDoodle((v) => !v)}>
        {showDoodle ? '🖊️ 그림 숨기기' : '🎨 그림일기 그리기'}
      </button>
      {showDoodle && <DoodlePad ref={doodleRef} initialImageUrl={doodleUrl} />}

      <button className="btn btn-block" onClick={handleSave} disabled={saving}>
        {saving ? '저장 중...' : existingEntry ? '수정 완료' : '일기 저장하고 포인트 받기 🍬'}
      </button>
    </div>
  )
}
